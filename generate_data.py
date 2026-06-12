#!/usr/bin/env python3
"""
Generate realistic CSV datasets for Supply Lens inventory management system.
Produces thousands of records with small, affordable prices (targeting small business/local shop customers).
"""

import csv
import random
import uuid
from datetime import datetime, timedelta
import os

random.seed(42)
OUTPUT_DIR = "inventory-management-system/backend/src/main/resources/data"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ─── 1. Open Food Facts Products (5000 rows) ─────────────────────────────────
print("Generating Open Food Facts products (5000 rows)...")

categories = [
    "Beverages", "Snacks", "Dairy", "Bakery", "Canned Goods", "Frozen Foods",
    "Condiments", "Cereals", "Pasta", "Rice", "Spices", "Oils", "Sauces",
    "Juice", "Tea", "Coffee", "Chocolate", "Biscuits", "Chips", "Nuts",
    "Dried Fruits", "Honey", "Jam", "Pickles", "Vinegar", "Flour",
    "Sugar", "Salt", "Noodles", "Soup Mix", "Baby Food", "Pet Food",
    "Cleaning Supplies", "Personal Care", "Health Supplements"
]

brands = [
    "FreshFarm", "NatureBite", "DailyBasics", "PureChoice", "HomeMade",
    "GreenLeaf", "SunValley", "TastyBites", "QuickMeal", "HealthyLife",
    "MorningFresh", "GoldenHarvest", "SimpleJoy", "KitchenPride", "NutriWell",
    "OrganicPlus", "FamilyFarm", "VillageMade", "CountryStyle", "LocalBest"
]

origins = [
    "India", "USA", "Brazil", "Mexico", "China", "Thailand", "Italy",
    "France", "Spain", "Germany", "Japan", "Indonesia", "Vietnam", "Turkey"
]

product_prefixes = [
    "Organic", "Fresh", "Premium", "Natural", "Homestyle", "Classic",
    "Traditional", "Artisan", "Farm Fresh", "Pure", "Golden", "Royal"
]

product_types = [
    "Milk", "Bread", "Rice", "Flour", "Sugar", "Salt", "Oil", "Butter",
    "Cheese", "Yogurt", "Juice", "Tea", "Coffee", "Biscuits", "Chips",
    "Noodles", "Pasta", "Sauce", "Jam", "Honey", "Pickle", "Vinegar",
    "Cereal", "Oats", "Cornflakes", "Muesli", "Soup", "Ketchup", "Mayonnaise",
    "Mustard", "Pepper", "Cinnamon", "Turmeric", "Cumin", "Coriander",
    "Chocolate Bar", "Candy", "Gum", "Crackers", "Popcorn", "Peanuts",
    "Almonds", "Cashews", "Raisins", "Dates", "Coconut Water", "Soda",
    "Energy Drink", "Mineral Water", "Sparkling Water", "Iced Tea",
    "Green Tea", "Black Tea", "Herbal Tea", "Instant Coffee", "Ground Coffee",
    "Whole Beans", "Cream", "Ice Cream", "Frozen Pizza", "Frozen Veggies",
    "Fish Fillet", "Chicken Nuggets", "French Fries", "Spring Rolls",
    "Samosa", "Paratha", "Chapati", "Tortilla", "Pita Bread", "Bagel",
    "Croissant", "Muffin", "Cake Mix", "Brownie Mix", "Pancake Mix",
    "Waffle Mix", "Syrup", "Peanut Butter", "Nutella", "Condensed Milk",
    "Evaporated Milk", "Coconut Milk", "Soy Milk", "Almond Milk", "Oat Milk",
    "Tofu", "Tempeh", "Lentils", "Chickpeas", "Black Beans", "Kidney Beans",
    "Corn", "Peas", "Tomato Paste", "Coconut Oil", "Olive Oil", "Sunflower Oil",
    "Sesame Oil", "Ghee", "Margarine", "Cream Cheese", "Mozzarella",
    "Cheddar", "Parmesan", "Feta", "Gouda", "Swiss Cheese"
]

with open(f"{OUTPUT_DIR}/en.openfoodfacts.org.products.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["code", "product_name", "generic_name", "brands", "categories", "main_category", "origins"])
    
    for i in range(5000):
        code = f"{random.randint(1000000000000, 9999999999999)}"
        prefix = random.choice(product_prefixes)
        ptype = random.choice(product_types)
        brand = random.choice(brands)
        name = f"{prefix} {brand} {ptype}"
        if random.random() > 0.7:
            size = random.choice(["100g", "200g", "250g", "500g", "1kg", "750ml", "1L", "2L", "Pack of 6", "Pack of 12"])
            name += f" {size}"
        generic = ptype
        cat = random.choice(categories)
        origin = random.choice(origins)
        writer.writerow([code, name, generic, brand, cat, cat, origin])

print("  ✓ en.openfoodfacts.org.products.csv (5000 rows)")

# ─── 2. Retail Store Inventory (2000 rows) ───────────────────────────────────
print("Generating Retail Store Inventory (2000 rows)...")

stores = [
    "Downtown Store", "Mall Outlet", "Highway Branch", "Airport Kiosk",
    "University Store", "Hospital Canteen", "Railway Station", "Bus Terminal",
    "Market Square", "Riverside Shop", "Hilltop Store", "Lakeview Branch",
    "Garden District", "Tech Park", "Industrial Zone"
]

retail_products = []
for prefix in product_prefixes[:6]:
    for ptype in product_types[:80]:
        retail_products.append(f"{prefix} {ptype}")

with open(f"{OUTPUT_DIR}/retail_store_inventory.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["Store ID", "Product Name", "Stock Quantity", "Reorder Point"])
    
    for i in range(2000):
        store = random.choice(stores)
        product = random.choice(retail_products)
        stock = random.randint(2, 80)
        reorder = random.randint(5, 25)
        writer.writerow([store, product, stock, reorder])

print("  ✓ retail_store_inventory.csv (2000 rows)")

# ─── 3. Supply Chain Data (1500 rows) ────────────────────────────────────────
print("Generating Supply Chain data (1500 rows)...")

supplier_names = [
    "FreshMart Distributors", "GreenValley Foods", "QuickStock Supply Co", "PrimeFresh Trading",
    "ValuePack Wholesale", "CityLink Logistics", "DailyGoods Partners", "FastRoute Commerce",
    "TrustChain Supply", "BrightPath Distributors", "SteadyFlow Trading", "AllStar Wholesale",
    "NorthStar Logistics", "PeakFresh Supply", "SafeHands Delivery", "CorePath Trading",
    "BlueLine Distributors", "GoldStar Wholesale", "EveryDay Supply Co", "SmartShelf Trading",
    "ClearView Logistics", "TopLine Distributors", "WellStock Partners", "FairTrade Supply",
    "SunRise Wholesale", "MidWest Distributors", "EastCoast Supply Co", "PacificRim Trading",
    "GreatLakes Wholesale", "SouthBay Distributors"
]

supply_product_types = [
    "Beverages", "Snacks", "Dairy Products", "Bakery Items", "Canned Goods",
    "Frozen Foods", "Condiments", "Cereals", "Pasta", "Rice",
    "Spices", "Cooking Oils", "Sauces", "Fresh Juice", "Tea",
    "Coffee", "Chocolate", "Biscuits", "Chips", "Dry Fruits",
    "Cleaning Products", "Personal Care", "Health Supplements", "Baby Products", "Pet Food"
]

with open(f"{OUTPUT_DIR}/supply_chain_data.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["Supplier name", "Product type", "Lead time", "Order quantities", "Price", "Manufacturing costs"])
    
    for i in range(1500):
        supplier = random.choice(supplier_names)
        product_type = random.choice(supply_product_types)
        lead_time = random.randint(2, 21)
        order_qty = random.randint(50, 2000)
        # Small prices for small business
        price = round(random.uniform(1.50, 45.00), 2)
        cost = round(price * random.uniform(0.4, 0.7), 2)
        writer.writerow([supplier, product_type, lead_time, order_qty, price, cost])

print("  ✓ supply_chain_data.csv (1500 rows)")

# ─── 4. Olist Customers (3000 rows) ──────────────────────────────────────────
print("Generating Olist Customers (3000 rows)...")

cities = [
    "Sao Paulo", "Rio de Janeiro", "Belo Horizonte", "Brasilia", "Salvador",
    "Fortaleza", "Curitiba", "Manaus", "Recife", "Porto Alegre",
    "Goiania", "Belem", "Guarulhos", "Campinas", "Sao Goncalo",
    "Sao Luis", "Maceio", "Duque de Caxias", "Natal", "Campo Grande",
    "Teresina", "Sao Bernardo do Campo", "Joao Pessoa", "Osasco", "Jaboatao",
    "Santo Andre", "Ribeirao Preto", "Uberlandia", "Sorocaba", "Contagem"
]

states = ["SP", "RJ", "MG", "DF", "BA", "CE", "PR", "AM", "PE", "RS", "GO", "PA", "MA", "AL", "RN", "MS", "PI", "PB"]

customer_ids = []
customer_unique_ids = []

with open(f"{OUTPUT_DIR}/olist_customers_dataset.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["customer_id", "customer_unique_id", "customer_zip_code_prefix", "customer_city", "customer_state"])
    
    for i in range(3000):
        cid = str(uuid.uuid4()).replace("-", "")
        uid = str(uuid.uuid4()).replace("-", "")[:32]
        customer_ids.append(cid)
        customer_unique_ids.append(uid)
        zipcode = str(random.randint(10000, 99999))
        city = random.choice(cities)
        state = random.choice(states)
        writer.writerow([cid, uid, zipcode, city, state])

print("  ✓ olist_customers_dataset.csv (3000 rows)")

# ─── 5. Olist Orders (5000 rows) ─────────────────────────────────────────────
print("Generating Olist Orders (5000 rows)...")

statuses = ["delivered", "shipped", "processing", "approved", "canceled"]
status_weights = [60, 15, 10, 10, 5]

order_ids = []

with open(f"{OUTPUT_DIR}/olist_orders_dataset.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["order_id", "customer_id", "order_status", "order_purchase_timestamp", "order_delivered_customer_date"])
    
    base_date = datetime(2025, 1, 1)
    
    for i in range(5000):
        oid = str(uuid.uuid4()).replace("-", "")
        order_ids.append(oid)
        cid = random.choice(customer_ids)
        status = random.choices(statuses, weights=status_weights, k=1)[0]
        
        days_ago = random.randint(0, 365)
        purchase_date = base_date + timedelta(days=days_ago, hours=random.randint(6, 22), minutes=random.randint(0, 59))
        purchase_str = purchase_date.strftime("%Y-%m-%d %H:%M:%S")
        
        if status == "delivered":
            delivered_date = purchase_date + timedelta(days=random.randint(2, 14))
            delivered_str = delivered_date.strftime("%Y-%m-%d %H:%M:%S")
        else:
            delivered_str = ""
        
        writer.writerow([oid, cid, status, purchase_str, delivered_str])

print("  ✓ olist_orders_dataset.csv (5000 rows)")

# ─── 6. Olist Order Items (8000 rows) ────────────────────────────────────────
print("Generating Olist Order Items (8000 rows)...")

with open(f"{OUTPUT_DIR}/olist_order_items_dataset.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["order_id", "order_item_id", "product_id", "seller_id", "price", "freight_value"])
    
    items_written = 0
    for oid in order_ids:
        num_items = random.choices([1, 2, 3, 4], weights=[50, 30, 15, 5], k=1)[0]
        for item_num in range(1, num_items + 1):
            if items_written >= 8000:
                break
            product_id = str(uuid.uuid4()).replace("-", "")
            seller_id = str(uuid.uuid4()).replace("-", "")[:16]
            # Small prices: ₹50 to ₹500 range (or $1 to $25 equivalent)
            price = round(random.uniform(1.50, 35.00), 2)
            freight = round(random.uniform(1.00, 8.00), 2)
            writer.writerow([oid, item_num, product_id, seller_id, price, freight])
            items_written += 1
        if items_written >= 8000:
            break

print(f"  ✓ olist_order_items_dataset.csv ({items_written} rows)")

# ─── Summary ─────────────────────────────────────────────────────────────────
print(f"\n{'='*60}")
print(f"ALL DATASETS GENERATED SUCCESSFULLY!")
print(f"{'='*60}")
print(f"  Location: {OUTPUT_DIR}/")
print(f"  Total records: ~{5000+2000+1500+3000+5000+8000:,}")
print(f"  Price range: $1.50 - $45.00 (small business friendly)")
print(f"{'='*60}")
