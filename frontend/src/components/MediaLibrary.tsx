import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useUpload } from "@/hooks/use-upload";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Image, Video, Upload, Check, X, Crop, ZoomIn, ZoomOut, RotateCw, Loader2 } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: "image" | "video";
  objectPath?: string | null;
  size?: number | null;
  mimeType?: string | null;
  createdAt: Date | string;
}

interface MediaLibraryProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  type?: "image" | "video" | "all";
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function MediaLibrary({ open, onClose, onSelect, type = "all" }: MediaLibraryProps) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [activeTab, setActiveTab] = useState<"library" | "upload" | "url" | "embed">("library");
  const [embedCode, setEmbedCode] = useState("");
  const queryClient = useQueryClient();
  
  const { data: mediaItems = [], isLoading } = useQuery<MediaItem[]>({
    queryKey: ["media", type],
    queryFn: async () => {
      const queryParam = type !== "all" ? `?type=${type}` : "";
      const res = await fetch(`/api/media${queryParam}`);
      if (!res.ok) throw new Error("Failed to fetch media");
      return res.json();
    },
    enabled: open,
  });

  const createMediaMutation = useMutation({
    mutationFn: async (item: Omit<MediaItem, "id" | "createdAt">) => {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error("Failed to create media item");
      return res.json() as Promise<MediaItem>;
    },
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: ["media", type] });
      queryClient.invalidateQueries({ queryKey: ["media", "all"] });
      setSelectedItem(newItem);
    },
  });

  const deleteMediaMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete media item");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media", type] });
      queryClient.invalidateQueries({ queryKey: ["media", "all"] });
      setSelectedItem(null);
    },
  });
  
  const { uploadFile, isUploading, progress } = useUpload({
    onSuccess: async (response) => {
      const isVideo = response.metadata.contentType?.startsWith("video/");
      await createMediaMutation.mutateAsync({
        name: response.metadata.name,
        url: response.objectPath,
        objectPath: response.objectPath,
        type: isVideo ? "video" : "image",
        size: response.metadata.size,
        mimeType: response.metadata.contentType,
      });
    },
  });

  const [showCropper, setShowCropper] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;
    
    const isVideo = urlInput.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || 
                    urlInput.includes("youtube.com") || 
                    urlInput.includes("vimeo.com");
    
    await createMediaMutation.mutateAsync({
      url: urlInput.trim(),
      name: urlInput.split("/").pop() || "External media",
      type: isVideo ? "video" : "image",
    });
    setUrlInput("");
  };

  const handleEmbedSubmit = async () => {
    if (!embedCode.trim()) return;
    
    const srcMatch = embedCode.match(/src=["']([^"']+)["']/);
    const url = srcMatch ? srcMatch[1] : embedCode;
    
    await createMediaMutation.mutateAsync({
      url: url,
      name: "Embedded video",
      type: "video",
    });
    setEmbedCode("");
  };

  const handleSelect = () => {
    if (selectedItem) {
      onSelect(selectedItem.url);
      onClose();
    }
  };

  const handleDelete = (item: MediaItem) => {
    deleteMediaMutation.mutate(item.id);
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
    }
  };

  const startCrop = (item: MediaItem) => {
    if (item.type !== "image") return;
    setCropImage(item.url);
    setCrop({ x: 0, y: 0, width: 100, height: 100 });
    setZoom(1);
    setRotation(0);
    setShowCropper(true);
  };

  const applyCrop = useCallback(async () => {
    if (!cropImage || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imageRef.current;
    const cropWidth = (img.naturalWidth * crop.width) / 100;
    const cropHeight = (img.naturalHeight * crop.height) / 100;
    const cropX = (img.naturalWidth * crop.x) / 100;
    const cropY = (img.naturalHeight * crop.y) / 100;

    canvas.width = cropWidth * zoom;
    canvas.height = cropHeight * zoom;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.drawImage(
      img,
      cropX, cropY, cropWidth, cropHeight,
      -cropWidth / 2, -cropHeight / 2, cropWidth, cropHeight
    );
    ctx.restore();

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    
    await createMediaMutation.mutateAsync({
      url: dataUrl,
      name: "Cropped image",
      type: "image",
    });
    
    setShowCropper(false);
    setCropImage(null);
  }, [cropImage, crop, zoom, rotation, createMediaMutation]);

  const filteredItems = type === "all" 
    ? mediaItems 
    : mediaItems.filter(item => item.type === type);

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Media Library</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="library" data-testid="tab-library">Library</TabsTrigger>
              <TabsTrigger value="upload" data-testid="tab-upload">Upload</TabsTrigger>
              <TabsTrigger value="url" data-testid="tab-url">URL</TabsTrigger>
              <TabsTrigger value="embed" data-testid="tab-embed">Embed</TabsTrigger>
            </TabsList>

            <TabsContent value="library" className="flex-1 overflow-auto mt-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                  <Image className="h-12 w-12 mb-2" />
                  <p>No media files yet</p>
                  <p className="text-sm">Upload files or add from URL</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all group ${
                        selectedItem?.id === item.id 
                          ? "border-black ring-2 ring-black/20" 
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                      onClick={() => setSelectedItem(item)}
                      data-testid={`media-item-${item.id}`}
                    >
                      {item.type === "image" ? (
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Video className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      
                      {selectedItem?.id === item.id && (
                        <div className="absolute top-2 right-2 bg-black rounded-full p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {item.type === "image" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => { e.stopPropagation(); startCrop(item); }}
                            data-testid={`crop-${item.id}`}
                          >
                            <Crop className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                          data-testid={`delete-${item.id}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-xs truncate">
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="upload" className="flex-1 mt-4">
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept={type === "video" ? "video/*" : type === "image" ? "image/*" : "image/*,video/*"}
                  onChange={handleFileUpload}
                  className="hidden"
                  id="media-upload"
                  disabled={isUploading}
                  data-testid="input-file-upload"
                />
                <label
                  htmlFor="media-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-12 w-12 animate-spin text-gray-400 mb-2" />
                      <p className="text-gray-600">Uploading... {progress}%</p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-gray-600">Click to upload</p>
                      <p className="text-sm text-gray-400">or drag and drop</p>
                    </>
                  )}
                </label>
              </div>
            </TabsContent>

            <TabsContent value="url" className="flex-1 mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="url-input">Image or Video URL</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="url-input"
                      placeholder="https://example.com/image.jpg"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      data-testid="input-url"
                    />
                    <Button onClick={handleUrlSubmit} data-testid="button-add-url">
                      Add
                    </Button>
                  </div>
                </div>
                {urlInput && (
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-2">Preview:</p>
                    {urlInput.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ? (
                      <video src={urlInput} className="max-h-48 rounded" controls />
                    ) : (
                      <img src={urlInput} alt="Preview" className="max-h-48 rounded" />
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="embed" className="flex-1 mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="embed-input">Embed Code (YouTube, Vimeo, etc.)</Label>
                  <textarea
                    id="embed-input"
                    className="w-full mt-2 p-3 border rounded-lg font-mono text-sm min-h-[100px]"
                    placeholder='<iframe src="https://www.youtube.com/embed/..." ...></iframe>'
                    value={embedCode}
                    onChange={(e) => setEmbedCode(e.target.value)}
                    data-testid="input-embed"
                  />
                  <Button onClick={handleEmbedSubmit} className="mt-2" data-testid="button-add-embed">
                    Add Video
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={onClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button 
              onClick={handleSelect} 
              disabled={!selectedItem}
              data-testid="button-select"
            >
              Select
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCropper} onOpenChange={(isOpen) => !isOpen && setShowCropper(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: "300px" }}>
              {cropImage && (
                <img
                  ref={imageRef}
                  src={cropImage}
                  alt="Crop preview"
                  className="max-w-full max-h-full object-contain mx-auto"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transition: "transform 0.2s"
                  }}
                  crossOrigin="anonymous"
                />
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <Label className="w-20">Zoom</Label>
                <ZoomOut className="h-4 w-4 text-gray-400" />
                <Slider
                  value={[zoom]}
                  onValueChange={([v]) => setZoom(v)}
                  min={0.5}
                  max={3}
                  step={0.1}
                  className="flex-1"
                />
                <ZoomIn className="h-4 w-4 text-gray-400" />
              </div>

              <div className="flex items-center gap-4">
                <Label className="w-20">Rotate</Label>
                <Slider
                  value={[rotation]}
                  onValueChange={([v]) => setRotation(v)}
                  min={0}
                  max={360}
                  step={1}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Width (%)</Label>
                  <Slider
                    value={[crop.width]}
                    onValueChange={([v]) => setCrop(c => ({ ...c, width: v }))}
                    min={10}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Height (%)</Label>
                  <Slider
                    value={[crop.height]}
                    onValueChange={([v]) => setCrop(c => ({ ...c, height: v }))}
                    min={10}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCropper(false)}>
              Cancel
            </Button>
            <Button onClick={applyCrop} data-testid="button-apply-crop">
              Apply Crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
