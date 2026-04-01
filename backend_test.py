#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class PortfolioAPITester:
    def __init__(self, base_url="https://8b6b0442-a558-4213-aa8c-5c5a5a82ea8c.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response preview: {str(response_data)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    "test": name,
                    "endpoint": endpoint,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "endpoint": endpoint,
                "error": str(e)
            })
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        return self.run_test("Health Check", "GET", "api/health", 200)

    def test_profile_endpoint(self):
        """Test profile endpoint - should return Mohamed Yazeed Faumy's data"""
        success, data = self.run_test("Profile Data", "GET", "api/profile", 200)
        if success:
            # Verify it contains Mohamed Yazeed Faumy's data
            if data.get('name') == 'Mohamed Yazeed Faumy':
                print("✅ Profile contains correct name: Mohamed Yazeed Faumy")
            else:
                print(f"⚠️  Profile name mismatch: {data.get('name')}")
            
            if 'IT Manager' in data.get('role', ''):
                print("✅ Profile contains correct role: IT Manager")
            else:
                print(f"⚠️  Role mismatch: {data.get('role')}")
        return success

    def test_projects_endpoint(self):
        """Test projects endpoint"""
        success, data = self.run_test("Projects Data", "GET", "api/projects", 200)
        if success and isinstance(data, list):
            print(f"✅ Found {len(data)} projects")
            for project in data[:2]:  # Show first 2 projects
                print(f"   - {project.get('title', 'No title')}")
        return success

    def test_featured_projects_endpoint(self):
        """Test featured projects endpoint"""
        success, data = self.run_test("Featured Projects", "GET", "api/projects/featured", 200)
        if success and isinstance(data, list):
            print(f"✅ Found {len(data)} featured projects")
        return success

    def test_blog_endpoints(self):
        """Test blog endpoints"""
        # Test published blog posts only
        success1, data1 = self.run_test("Published Blog Posts", "GET", "api/blog", 200)
        if success1 and isinstance(data1, list):
            print(f"✅ Found {len(data1)} published blog posts")
            # Check if all returned posts are published
            unpublished = [post for post in data1 if not post.get('published', True)]
            if not unpublished:
                print("✅ All returned posts are published")
            else:
                print(f"⚠️  Found {len(unpublished)} unpublished posts in published endpoint")

        # Test all blog posts
        success2, data2 = self.run_test("All Blog Posts", "GET", "api/blog/all", 200)
        if success2 and isinstance(data2, list):
            print(f"✅ Found {len(data2)} total blog posts")

        return success1 and success2

    def test_experience_endpoint(self):
        """Test experience endpoint"""
        success, data = self.run_test("Experience Data", "GET", "api/experience", 200)
        if success and isinstance(data, list):
            print(f"✅ Found {len(data)} experience entries")
            # Check for current role
            current_roles = [exp for exp in data if exp.get('current', False)]
            if current_roles:
                print(f"✅ Found current role: {current_roles[0].get('role')}")
        return success

    def test_skills_endpoint(self):
        """Test skills endpoint"""
        success, data = self.run_test("Skills Data", "GET", "api/skills", 200)
        if success and isinstance(data, list):
            print(f"✅ Found {len(data)} skills")
        return success

    def test_socials_endpoint(self):
        """Test socials endpoint"""
        success, data = self.run_test("Socials Data", "GET", "api/socials", 200)
        if success and isinstance(data, list):
            print(f"✅ Found {len(data)} social links")
        return success

    def test_linkedin_posts_endpoint(self):
        """Test LinkedIn posts endpoint"""
        success, data = self.run_test("LinkedIn Posts", "GET", "api/linkedin-posts", 200)
        if success and isinstance(data, list):
            print(f"✅ Found {len(data)} LinkedIn posts")
        return success

    def test_github_contributions_endpoint(self):
        """Test GitHub contributions endpoint"""
        success, data = self.run_test("GitHub Contributions", "GET", "api/github-contributions", 200)
        if success and isinstance(data, list):
            print(f"✅ Found {len(data)} GitHub contribution entries")
        return success

    def test_site_config_endpoint(self):
        """Test site config endpoint"""
        success, data = self.run_test("Site Config", "GET", "api/site-config", 200)
        if success:
            hero_data = data.get('hero', {})
            if hero_data.get('title') == 'TECH' and hero_data.get('subtitle') == 'LEADER':
                print("✅ Site config contains correct hero titles")
            else:
                print(f"⚠️  Hero titles: {hero_data.get('title')} / {hero_data.get('subtitle')}")
        return success

    def test_seed_endpoint(self):
        """Test seed endpoint (should indicate already seeded)"""
        success, data = self.run_test("Seed Data", "POST", "api/seed", 200)
        if success:
            if data.get('seeded') == False:
                print("✅ Database already seeded (expected)")
            else:
                print("✅ Database seeded successfully")
        return success

def main():
    print("🚀 Starting Portfolio API Tests")
    print("=" * 50)
    
    tester = PortfolioAPITester()
    
    # Run all tests
    test_results = []
    
    test_results.append(tester.test_health_check())
    test_results.append(tester.test_profile_endpoint())
    test_results.append(tester.test_projects_endpoint())
    test_results.append(tester.test_featured_projects_endpoint())
    test_results.append(tester.test_blog_endpoints())
    test_results.append(tester.test_experience_endpoint())
    test_results.append(tester.test_skills_endpoint())
    test_results.append(tester.test_socials_endpoint())
    test_results.append(tester.test_linkedin_posts_endpoint())
    test_results.append(tester.test_github_contributions_endpoint())
    test_results.append(tester.test_site_config_endpoint())
    test_results.append(tester.test_seed_endpoint())
    
    # Print summary
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            if 'error' in failure:
                print(f"   - {failure['test']}: {failure['error']}")
            else:
                print(f"   - {failure['test']}: Status {failure['actual']} (expected {failure['expected']})")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"\n🎯 Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())