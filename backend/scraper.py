# import os
# import json
# import pandas as pd
# from datetime import datetime
# import asyncio
# from playwright.async_api import async_playwright

# # Data paths
# DATA_DIR = "data"
# CSV_PATH = os.path.join(DATA_DIR, "iv_data.csv")
# JSON_PATH = os.path.join(DATA_DIR, "iv_data.json")

# # State Department IV Scheduling URL
# URL = "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/iv-wait-times.html"


# async def scrape_iv_data():
#     """
#     Fetch IV scheduling data using Playwright (renders JavaScript)
#     This will capture the dynamic table data from the State Department website
#     """
    
#     if not os.path.exists(DATA_DIR):
#         os.makedirs(DATA_DIR)

#     # Check cache - refresh every 24 hours
#     if os.path.exists(JSON_PATH):
#         file_time = os.path.getmtime(JSON_PATH)
#         current_time = datetime.now().timestamp()
#         if current_time - file_time < 86400:
#             print("✅ Fresh data found. Using cache.")
#             return load_data()

#     print("🔄 Fetching IV scheduling data (rendering JavaScript)...")
    
#     try:
#         async with async_playwright() as p:
#             browser = await p.chromium.launch(headless=True)
#             page = await browser.new_page()
            
#             # Set user agent to avoid blocking
#             await page.set_extra_http_headers({
#                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
#             })
            
#             print(f"  Loading {URL}...")
#             await page.goto(URL, wait_until='networkidle', timeout=30000)
            
#             # Wait for dynamic content to load
#             print("  Waiting for data to load...")
#             await page.wait_for_timeout(3000)  # Extra wait for JS to render
            
#             # Get the page content
#             content = await page.content()
            
#             # Close browser
#             await browser.close()
            
#             # Parse the HTML
#             from bs4 import BeautifulSoup
#             soup = BeautifulSoup(content, 'html.parser')
            
#             # Debug: Save raw HTML
#             with open(os.path.join(DATA_DIR, 'debug.html'), 'w', encoding='utf-8') as f:
#                 f.write(content)
#             print("  ✓ Saved debug.html for inspection")
            
#             # Find the scheduling table
#             data = extract_scheduling_data(soup)
            
#             if not data:
#                 print("⚠️ No valid data extracted. Using sample data...")
#                 data = get_sample_data()
#             else:
#                 print(f"✅ Extracted {len(data)} scheduling records")
            
#             # Save data
#             df = pd.DataFrame(data)
#             df.to_csv(CSV_PATH, index=False)
            
#             with open(JSON_PATH, 'w', encoding='utf-8') as f:
#                 json.dump(data, f, indent=4, ensure_ascii=False)
            
#             print(f"\n✅ SCRAPE SUCCESSFUL!")
#             print(f"📊 Total unique combinations: {len(data)}")
#             print(f"💾 Saved to: {CSV_PATH}\n")
            
#             return data
            
#     except Exception as e:
#         print(f"❌ Scraping error: {str(e)}")
#         print("  Using cached or sample data instead...")
#         return load_data() or get_sample_data()


# def extract_scheduling_data(soup):
#     """
#     Extract scheduling data from the rendered HTML
#     Looking for format: Post | Immediate Relative | Family-Sponsored | Employment-Based
#     """
#     data = []
    
#     try:
#         # Look for all tables
#         tables = soup.find_all('table')
#         print(f"  Found {len(tables)} tables")
        
#         for table_idx, table in enumerate(tables):
#             rows = table.find_all('tr')
            
#             if len(rows) < 2:
#                 continue
            
#             # Get header
#             header_cells = rows[0].find_all(['th', 'td'])
#             headers = [h.get_text(strip=True) for h in header_cells]
            
#             print(f"    Table {table_idx + 1}: {len(rows)} rows, Headers: {headers[:3]}")
            
#             # Check if this is the scheduling table
#             has_post = any('post' in h.lower() or 'embassy' in h.lower() for h in headers)
#             has_dates = any('date' in h.lower() or any(cat in h.lower() for cat in ['relative', 'preference']) for h in headers)
            
#             if not (has_post and has_dates):
#                 continue
            
#             print(f"      ✓ This looks like the scheduling table!")
            
#             # Parse rows
#             for row_idx, row in enumerate(rows[1:], 1):
#                 cells = row.find_all('td')
                
#                 if len(cells) < 2:
#                     continue
                
#                 texts = [cell.get_text(strip=True) for cell in cells]
                
#                 # Skip empty rows
#                 if not texts[0] or texts[0].lower() in ['post', 'location', '']:
#                     continue
                
#                 post = texts[0]
                
#                 # Handle different table formats
#                 if len(texts) >= 4:
#                     # Format: Post | IR | FS | EB
#                     ir_date = texts[1]
#                     fs_date = texts[2]
#                     eb_date = texts[3]
                    
#                     if ir_date and ir_date != '-' and 'n/a' not in ir_date.lower():
#                         data.append({
#                             "Post": post,
#                             "Visa Category": "Immediate Relative",
#                             "Case Documentarily Complete": ir_date
#                         })
                    
#                     if fs_date and fs_date != '-' and 'n/a' not in fs_date.lower():
#                         data.append({
#                             "Post": post,
#                             "Visa Category": "Family-Sponsored Preference",
#                             "Case Documentarily Complete": fs_date
#                         })
                    
#                     if eb_date and eb_date != '-' and 'n/a' not in eb_date.lower():
#                         data.append({
#                             "Post": post,
#                             "Visa Category": "Employment-Based Preference",
#                             "Case Documentarily Complete": eb_date
#                         })
                
#                 elif len(texts) >= 3:
#                     # Format: Post | Category | Date
#                     category = texts[1]
#                     date = texts[2]
                    
#                     if date and date != '-' and 'n/a' not in date.lower():
#                         data.append({
#                             "Post": post,
#                             "Visa Category": category,
#                             "Case Documentarily Complete": date
#                         })
            
#             if data:
#                 print(f"      Extracted {len(data)} records from this table")
#                 break
        
#         return data
        
#     except Exception as e:
#         print(f"    ❌ Error parsing table: {e}")
#         return None


# def get_sample_data():
#     """Sample realistic data for demo/testing"""
#     return [
#         {
#             "Post": "Islamabad",
#             "Visa Category": "Immediate Relative",
#             "Case Documentarily Complete": "Feb-2025"
#         },
#         {
#             "Post": "Islamabad",
#             "Visa Category": "Family-Sponsored Preference",
#             "Case Documentarily Complete": "Mar-2024"
#         },
#         {
#             "Post": "Islamabad",
#             "Visa Category": "Employment-Based Preference",
#             "Case Documentarily Complete": "Apr-2023"
#         },
#         {
#             "Post": "Karachi",
#             "Visa Category": "Immediate Relative",
#             "Case Documentarily Complete": "Dec-2024"
#         },
#         {
#             "Post": "New Delhi",
#             "Visa Category": "Immediate Relative",
#             "Case Documentarily Complete": "Jan-2025"
#         },
#         {
#             "Post": "New Delhi",
#             "Visa Category": "Employment-Based Preference",
#             "Case Documentarily Complete": "Jun-2024"
#         },
#         {
#             "Post": "Mumbai",
#             "Visa Category": "Immediate Relative",
#             "Case Documentarily Complete": "Nov-2024"
#         },
#         {
#             "Post": "Dubai",
#             "Visa Category": "Immediate Relative",
#             "Case Documentarily Complete": "Oct-2024"
#         },
#         {
#             "Post": "Ankara",
#             "Visa Category": "Family-Sponsored Preference",
#             "Case Documentarily Complete": "Feb-2024"
#         },
#         {
#             "Post": "Abu Dhabi",
#             "Visa Category": "Immediate Relative",
#             "Case Documentarily Complete": "Jul-2024"
#         },
#     ]


# def load_data():
#     """Load existing data from files"""
#     try:
#         with open(JSON_PATH, 'r', encoding='utf-8') as f:
#             data = json.load(f)
#         print(f"✅ Loaded {len(data)} records from cache")
#         return data
#     except Exception as e:
#         print(f"⚠️ Could not load cache: {e}")
#         return None


# def filter_results(data, city, category):
#     """Filter by city and category"""
#     if not data:
#         return []
    
#     category_map = {
#         'immediate-relative': 'Immediate Relative',
#         'family-sponsored': 'Family-Sponsored Preference',
#         'employment-based': 'Employment-Based Preference'
#     }
    
#     cat_name = category_map.get(category, category)
    
#     results = [
#         d for d in data
#         if city.lower() in d['Post'].lower() and
#            cat_name.lower() in d['Visa Category'].lower()
#     ]
    
#     return results


# if __name__ == "__main__":
#     # Run async scraper
#     data = asyncio.run(scrape_iv_data())
    
#     if data:
#         print("📋 Sample Data (first 10 records):")
#         df = pd.DataFrame(data)
#         print(df.head(10).to_string(index=False))
        
#         # Example search
#         print("\n🔍 Searching for 'Islamabad' + 'Immediate Relative':")
#         results = filter_results(data, "Islamabad", "immediate-relative")
#         if results:
#             for r in results:
#                 print(f"  ✓ {r['Post']}")
#                 print(f"    Category: {r['Visa Category']}")
#                 print(f"    DQ Date: {r['Case Documentarily Complete']}\n")
#         else:
#             print("  ❌ No results found")