import os
import json
import pandas as pd
from datetime import datetime
import requests
from bs4 import BeautifulSoup

# Paths - relative to backend/
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
CSV_PATH = os.path.join(DATA_DIR, "iv_data.csv")
JSON_PATH = os.path.join(DATA_DIR, "iv_data.json")
URL = "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/iv-wait-times.html"


def get_iv_schedule_data():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)

    # Cache valid for 24 hours
    if os.path.exists(JSON_PATH):
        file_time = os.path.getmtime(JSON_PATH)
        if datetime.now().timestamp() - file_time < 86400:
            with open(JSON_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)

    print("Scraping fresh IV data...")
    return scrape_iv_data()


def scrape_iv_data():
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }

        print(f"Fetching HTML from {URL} ...")
        response = requests.get(URL, headers=headers, timeout=30)

        if response.status_code != 200:
            print("Failed to load page. Using sample.")
            return get_sample_data()

        soup = BeautifulSoup(response.text, "html.parser")
        data = extract_scheduling_data(soup)

        if not data:
            print("No data found. Using sample...")
            data = get_sample_data()

        df = pd.DataFrame(data)
        df.to_csv(CSV_PATH, index=False)
        with open(JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)

        print(f"Scraped {len(data)} records!")
        return data

    except Exception as e:
        print(f"Scraping error: {e}")
        return get_sample_data()


def extract_scheduling_data(soup):
    data = []
    tables = soup.find_all("table")

    for table in tables:
        rows = table.find_all("tr")
        if len(rows) < 2:
            continue

        headers = [h.get_text(strip=True).lower() for h in rows[0].find_all(['th', 'td'])]
        if not any("post" in h for h in headers):
            continue

        for row in rows[1:]:
            cells = row.find_all("td")
            if len(cells) < 4:
                continue

            texts = [c.get_text(strip=True) for c in cells]
            post, ir, fs, eb = texts[0], texts[1], texts[2], texts[3]

            def add_record(label, value):
                if value and value != "-" and "n/a" not in value.lower():
                    data.append({
                        "Post": post,
                        "Visa Category": label,
                        "Case Documentarily Complete": value
                    })

            add_record("Immediate Relative", ir)
            add_record("Family-Sponsored Preference", fs)
            add_record("Employment-Based Preference", eb)

        if data:
            break

    return data


def get_sample_data():
    return [
        {"Post": "Islamabad", "Visa Category": "Immediate Relative", "Case Documentarily Complete": "Feb-2025"},
        {"Post": "Karachi", "Visa Category": "Immediate Relative", "Case Documentarily Complete": "Dec-2024"},
    ]


def filter_iv_data(data, city="", category=""):
    if not data:
        return []

    category_map = {
        'immediate-relative': 'Immediate Relative',
        'family-sponsored': 'Family-Sponsored Preference',
        'employment-based': 'Employment-Based Preference'
    }

    cat_name = category_map.get(category.lower(), category)

    return [
        d for d in data
        if (not city or city.lower() in d["Post"].lower()) and
           (not category or cat_name.lower() in d["Visa Category"].lower())
    ]
