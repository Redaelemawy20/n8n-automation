import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Product Catalog Seeder
// Nodes   : 4  |  Connections: 3
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Webhook                            webhook
// Products                           code
// AppendToCatalog                    googleSheets               [creds]
// RespondToWebhook                   respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Webhook
//    → Products
//      → AppendToCatalog
//        → RespondToWebhook
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'ckwSY1eC7ytFf5Fp',
    name: 'Product Catalog Seeder',
    active: true,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: true },
})
export class ProductCatalogSeederWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '7c1e9a42-3b5d-4f8e-a6c2-0d9b4e7f1a35',
        webhookId: 'e4a7b2c9-5d1f-4c3e-8b6a-2f9d0c7e1b48',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-288, -32],
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'seed-products',
        authentication: 'none',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: '2f8d4b6a-9c3e-4a1f-b7d5-6e0c8a2f4b91',
        name: 'Products',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-32, -32],
    })
    Products = {
        jsCode: `// 100 dummy products: [Name, Category, Price, Stock, Description]
const products = [
  // Electronics
  ["Wireless Mouse", "Electronics", 19.99, 120, "Ergonomic 2.4 GHz wireless mouse with a silent click, adjustable DPI up to 1600 and up to 12 months of battery life."],
  ["Mechanical Keyboard", "Electronics", 79.99, 45, "Full-size mechanical keyboard with tactile brown switches, white backlighting and a detachable USB-C cable."],
  ["USB-C Charger 65W", "Electronics", 34.5, 80, "Compact GaN wall charger that fast-charges laptops, tablets and phones through a single USB-C port."],
  ["Bluetooth Speaker", "Electronics", 49.99, 60, "Portable waterproof speaker with deep bass, 360-degree sound and 14 hours of playtime on one charge."],
  ["Noise Cancelling Headphones", "Electronics", 149.0, 25, "Over-ear headphones with active noise cancellation, soft memory-foam cushions and 30-hour battery life."],
  ["27\\" LED Monitor", "Electronics", 219.99, 18, "27-inch Full HD IPS monitor with slim bezels, 75 Hz refresh rate and built-in eye-care flicker-free mode."],
  ["Webcam 1080p", "Electronics", 39.99, 70, "Full HD webcam with autofocus, a dual noise-reducing microphone and a universal clip for laptops and monitors."],
  ["Portable SSD 1TB", "Electronics", 99.0, 40, "Pocket-sized 1TB solid-state drive with transfer speeds up to 1050 MB/s and a shock-resistant aluminum shell."],
  ["Smart Watch", "Electronics", 129.99, 30, "Fitness smart watch with heart-rate and sleep tracking, built-in GPS, notifications and 7-day battery life."],
  ["Power Bank 20000mAh", "Electronics", 29.99, 95, "High-capacity power bank with two USB-A ports and one USB-C port that charges a phone up to four times."],

  // Home
  ["LED Desk Lamp", "Home", 24.99, 75, "Dimmable LED desk lamp with three color temperatures, a flexible arm and a USB charging port in the base."],
  ["Scented Candle Set", "Home", 15.5, 110, "Set of three soy wax candles in vanilla, lavender and sandalwood scents, each burning for about 25 hours."],
  ["Throw Blanket", "Home", 32.0, 50, "Soft knitted throw blanket in a neutral tone, ideal for the sofa or bed and machine washable."],
  ["Wall Clock", "Home", 21.99, 40, "Minimalist 30 cm wall clock with a silent quartz movement and easy-to-read numbers."],
  ["Decorative Cushion", "Home", 12.99, 140, "Square 45 x 45 cm cushion with a removable linen-look cover and a plump polyester filling."],
  ["Storage Basket", "Home", 18.75, 65, "Woven cotton rope basket with sturdy handles, perfect for blankets, toys or laundry."],
  ["Picture Frame Set", "Home", 22.5, 55, "Set of six black frames in mixed sizes with glass fronts, ready for wall hanging or tabletop display."],
  ["Indoor Plant Pot", "Home", 14.0, 90, "Matte ceramic plant pot with a drainage hole and bamboo saucer, sized for medium indoor plants."],
  ["Bath Towel Set", "Home", 27.99, 60, "Four-piece set of absorbent 100% cotton towels: two bath towels and two hand towels."],
  ["Aroma Diffuser", "Home", 35.0, 35, "Ultrasonic essential oil diffuser with a 300 ml tank, seven LED colors and automatic shut-off."],

  // Kitchen
  ["Ceramic Coffee Mug", "Kitchen", 8.99, 200, "Classic 350 ml ceramic mug with a glossy glaze, microwave and dishwasher safe."],
  ["Stainless Steel Pan", "Kitchen", 42.0, 38, "28 cm tri-ply stainless steel frying pan that heats evenly and works on all stovetops, including induction."],
  ["Chef Knife", "Kitchen", 55.5, 28, "20 cm chef knife forged from high-carbon German steel with a full tang and comfortable ergonomic handle."],
  ["Cutting Board", "Kitchen", 16.99, 85, "Large bamboo cutting board with a juice groove and side handles, gentle on knife edges."],
  ["Electric Kettle", "Kitchen", 29.99, 47, "1.7 L stainless steel electric kettle with rapid boil, auto shut-off and boil-dry protection."],
  ["Glass Food Containers", "Kitchen", 24.5, 72, "Set of five borosilicate glass containers with airtight snap-lock lids, oven and freezer safe."],
  ["Blender", "Kitchen", 64.99, 22, "1000 W countertop blender with a 1.5 L jar and three speed settings for smoothies, soups and sauces."],
  ["Measuring Cups Set", "Kitchen", 9.99, 130, "Six nesting stainless steel measuring cups with engraved metric and imperial markings."],
  ["French Press", "Kitchen", 27.0, 44, "1 L French press with a heat-resistant glass carafe and four-level filtration for rich, full-bodied coffee."],
  ["Silicone Spatula Set", "Kitchen", 11.5, 105, "Three heat-resistant silicone spatulas, safe on non-stick cookware up to 230 °C."],

  // Office
  ["Spiral Notebook A5", "Office", 4.99, 300, "A5 spiral notebook with 120 pages of 80 gsm ruled paper and a durable laminated cover."],
  ["Gel Pen Pack", "Office", 6.5, 250, "Pack of ten 0.5 mm gel pens in assorted colors with quick-drying, smudge-resistant ink."],
  ["Desk Organizer", "Office", 19.0, 60, "Mesh metal desk organizer with five compartments and a sliding drawer for pens, notes and clips."],
  ["Ergonomic Office Chair", "Office", 189.99, 12, "Breathable mesh office chair with adjustable lumbar support, armrests and seat height."],
  ["Stapler", "Office", 7.99, 150, "Heavy-duty desktop stapler that staples up to 25 sheets, with a built-in staple remover."],
  ["Sticky Notes Pack", "Office", 5.25, 280, "Twelve pads of 76 x 76 mm sticky notes in bright colors with strong, residue-free adhesive."],
  ["Whiteboard 60x90", "Office", 45.0, 20, "Magnetic dry-erase whiteboard with an aluminum frame, marker tray and wall-mounting kit."],
  ["File Folders (10 pack)", "Office", 9.5, 175, "Ten letter-size manila file folders with one-third cut tabs for easy labeling."],
  ["Laptop Stand", "Office", 33.99, 58, "Adjustable aluminum laptop stand that raises the screen to eye level and folds flat for travel."],
  ["Paper Shredder", "Office", 74.0, 15, "Cross-cut shredder that handles 8 sheets at once, plus credit cards, with a 15 L bin."],

  // Sports
  ["Yoga Mat", "Sports", 25.99, 90, "6 mm non-slip TPE yoga mat with alignment lines and a carrying strap."],
  ["Dumbbell Set 10kg", "Sports", 49.0, 30, "Adjustable 10 kg dumbbell set with chrome handles and secure spin-lock collars."],
  ["Jump Rope", "Sports", 8.5, 160, "Speed jump rope with ball-bearing handles and an adjustable steel cable for cardio training."],
  ["Water Bottle 1L", "Sports", 14.99, 210, "Insulated 1 L stainless steel bottle that keeps drinks cold for 24 hours or hot for 12."],
  ["Resistance Bands", "Sports", 17.99, 115, "Set of five latex resistance bands in different strengths for strength training and physiotherapy."],
  ["Football", "Sports", 22.0, 70, "Size 5 match football with a machine-stitched cover, suitable for grass and artificial turf."],
  ["Tennis Racket", "Sports", 59.99, 26, "Lightweight graphite tennis racket with a 100 sq in head, pre-strung, for beginners and intermediates."],
  ["Cycling Helmet", "Sports", 44.5, 34, "Ventilated road and mountain bike helmet with an adjustable fit dial and removable visor."],
  ["Gym Bag", "Sports", 31.0, 52, "40 L water-resistant gym bag with a separate shoe compartment and padded shoulder strap."],
  ["Foam Roller", "Sports", 19.5, 66, "High-density textured foam roller for muscle recovery and deep-tissue massage."],

  // Clothing
  ["Cotton T-Shirt", "Clothing", 12.99, 240, "Crew-neck t-shirt made from soft 100% organic cotton with a regular fit."],
  ["Denim Jeans", "Clothing", 39.99, 95, "Slim-fit stretch denim jeans with a classic five-pocket design and mid-rise waist."],
  ["Hooded Sweatshirt", "Clothing", 34.0, 80, "Brushed fleece hoodie with a kangaroo pocket and adjustable drawstring hood."],
  ["Running Shoes", "Clothing", 69.99, 48, "Lightweight running shoes with breathable mesh uppers and responsive cushioned soles."],
  ["Baseball Cap", "Clothing", 14.5, 130, "Six-panel cotton baseball cap with a curved brim and adjustable strap back."],
  ["Winter Jacket", "Clothing", 89.0, 27, "Insulated water-repellent winter jacket with a detachable hood and fleece-lined pockets."],
  ["Wool Socks (3 pack)", "Clothing", 11.99, 170, "Three pairs of warm merino wool blend socks with cushioned soles and reinforced heels."],
  ["Leather Belt", "Clothing", 24.0, 64, "Genuine leather belt with a brushed metal buckle, 3.5 cm wide."],
  ["Rain Coat", "Clothing", 49.5, 36, "Lightweight waterproof rain coat with sealed seams and a packable hood."],
  ["Polo Shirt", "Clothing", 22.99, 110, "Classic pique cotton polo shirt with a two-button placket and ribbed collar."],

  // Beauty
  ["Moisturizing Cream", "Beauty", 18.99, 88, "Daily face moisturizer with hyaluronic acid and vitamin E for 24-hour hydration."],
  ["Shampoo 500ml", "Beauty", 9.99, 160, "Sulfate-free shampoo with argan oil that gently cleanses and adds shine to all hair types."],
  ["Conditioner 500ml", "Beauty", 9.99, 150, "Nourishing conditioner with shea butter that detangles and softens dry or damaged hair."],
  ["Sunscreen SPF 50", "Beauty", 15.5, 100, "Broad-spectrum SPF 50 sunscreen with a lightweight, non-greasy, water-resistant formula."],
  ["Lip Balm", "Beauty", 3.99, 320, "Moisturizing lip balm with beeswax and coconut oil to soothe and protect dry lips."],
  ["Face Wash", "Beauty", 11.25, 125, "Gentle foaming face wash with green tea extract that removes dirt and excess oil."],
  ["Hair Dryer", "Beauty", 39.0, 33, "2000 W ionic hair dryer with three heat settings, a cool shot button and a concentrator nozzle."],
  ["Perfume 50ml", "Beauty", 59.99, 40, "Eau de parfum with fresh citrus top notes and a warm amber and musk base."],
  ["Makeup Brush Set", "Beauty", 21.5, 57, "Twelve-piece makeup brush set with soft synthetic bristles and a travel pouch."],
  ["Electric Toothbrush", "Beauty", 44.99, 42, "Rechargeable sonic toothbrush with three cleaning modes, a 2-minute timer and two brush heads."],

  // Toys
  ["Building Blocks Set", "Toys", 29.99, 62, "500-piece building blocks set compatible with major brands, for creative play from age 6."],
  ["Puzzle 1000 Pieces", "Toys", 16.5, 78, "1000-piece jigsaw puzzle featuring a colorful landscape, with precision-cut interlocking pieces."],
  ["Remote Control Car", "Toys", 45.0, 29, "Off-road RC car with a 2.4 GHz remote, rechargeable battery and top speed of 25 km/h."],
  ["Plush Teddy Bear", "Toys", 19.99, 85, "Extra-soft 40 cm plush teddy bear made from child-safe, machine-washable materials."],
  ["Board Game Classic", "Toys", 27.5, 46, "Family strategy board game for 2 to 6 players, with games lasting about 45 minutes."],
  ["Art & Craft Kit", "Toys", 22.0, 54, "All-in-one craft kit with paints, markers, glitter, stickers and paper for young artists."],
  ["Toy Train Set", "Toys", 38.99, 23, "Battery-powered train set with a locomotive, three carriages and 20 pieces of track."],
  ["Kids Drawing Tablet", "Toys", 14.99, 97, "8.5-inch LCD writing tablet for doodling and practice, erasable with one button."],
  ["Water Gun", "Toys", 9.5, 140, "Pump-action water blaster with a 500 ml tank and a range of up to 8 meters."],
  ["Rubik Cube", "Toys", 7.99, 190, "Smooth-turning 3x3 speed cube with vivid stickerless colors."],

  // Books
  ["Cookbook: Easy Meals", "Books", 24.99, 44, "Over 100 simple, healthy recipes for busy weeknights, with step-by-step photos."],
  ["Mystery Novel", "Books", 13.5, 88, "A gripping detective story set in a small coastal town, full of twists until the final page."],
  ["Science Encyclopedia", "Books", 39.0, 19, "Illustrated encyclopedia covering physics, chemistry, biology and space for curious readers."],
  ["Kids Story Book", "Books", 8.99, 120, "A colorful picture book of bedtime stories about friendship and kindness for ages 3 to 7."],
  ["Self-Help Guide", "Books", 16.0, 73, "A practical guide to building good habits, managing time and staying motivated."],
  ["Travel Guide: Europe", "Books", 21.5, 37, "Up-to-date travel guide to Europe with maps, itineraries and tips on food and culture."],
  ["Programming Basics", "Books", 34.99, 41, "A beginner-friendly introduction to programming concepts with hands-on exercises."],
  ["Poetry Collection", "Books", 11.0, 58, "An anthology of classic and modern poems about nature, love and everyday life."],
  ["History of Art", "Books", 45.5, 16, "A richly illustrated journey through art history from ancient times to the present day."],
  ["Fantasy Saga Vol. 1", "Books", 17.99, 92, "The first book in an epic fantasy series about a young hero, ancient magic and a kingdom at war."],

  // Garden
  ["Garden Hose 15m", "Garden", 27.99, 39, "Flexible 15 m kink-resistant garden hose with a seven-pattern spray nozzle."],
  ["Pruning Shears", "Garden", 18.5, 63, "Sharp bypass pruning shears with stainless steel blades and non-slip grips."],
  ["Seed Starter Kit", "Garden", 12.0, 110, "Complete seed starting kit with a tray, humidity dome, peat pellets and plant labels."],
  ["Watering Can", "Garden", 14.99, 76, "5 L plastic watering can with a removable rose head for gentle watering."],
  ["Garden Gloves", "Garden", 6.99, 180, "Breathable garden gloves with latex-coated palms for grip and thorn protection."],
  ["Solar Garden Lights", "Garden", 29.0, 48, "Pack of eight solar LED path lights that switch on automatically at dusk."],
  ["Bird Feeder", "Garden", 16.75, 52, "Hanging metal bird feeder with four feeding ports and a weatherproof roof."],
  ["Compost Bin", "Garden", 54.99, 14, "300 L outdoor compost bin with ventilation slots and an easy-access bottom hatch."],
  ["Lawn Sprinkler", "Garden", 22.5, 41, "Oscillating lawn sprinkler covering up to 300 square meters with adjustable range."],
  ["Outdoor Planter Box", "Garden", 36.0, 28, "Raised wooden planter box made from treated pine, ideal for herbs and vegetables."],
];

// Optional { "count": n } in the request body limits how many products are added
const requested = Number($('Webhook').first().json.body?.count);
const count = requested > 0 ? Math.min(requested, products.length) : products.length;

const createdAt = new Date().toISOString();

// Keys match the sheet header row: Name | Description | Price | Category | Stock | CreatedAt
return products.slice(0, count).map(([name, category, price, stock, description]) => ({
  json: {
    Name: name,
    Description: description,
    Price: price,
    Category: category,
    Stock: stock,
    CreatedAt: createdAt,
  },
}));
`,
    };

    @node({
        id: '9a3c5e7b-1d4f-4b8a-9e2c-7f6d0b3a5c18',
        name: 'Append to catalog',
        type: 'n8n-nodes-base.googleSheets',
        version: 4.7,
        position: [224, -32],
        credentials: { googleSheetsOAuth2Api: { id: '6JwBJOQl0iimeFgk', name: 'Google Sheets account 2' } },
    })
    AppendToCatalog = {
        resource: 'sheet',
        operation: 'append',
        documentId: {
            __rl: true,
            value: 'https://docs.google.com/spreadsheets/d/1Txajl1p6_ftfXh1t17xsDAQekMjMnkaaLYgMiNUuZtY/edit?gid=0#gid=0',
            mode: 'url',
        },
        sheetName: {
            __rl: true,
            value: 'https://docs.google.com/spreadsheets/d/1Txajl1p6_ftfXh1t17xsDAQekMjMnkaaLYgMiNUuZtY/edit?gid=0#gid=0',
            mode: 'url',
        },
        columns: {
            mappingMode: 'autoMapInputData',
            value: {},
            matchingColumns: [],
            schema: [],
        },
        options: {},
    };

    @node({
        id: '5b7d9f1c-3e6a-4c2b-8d4f-1a0e6c9b3d72',
        name: 'Respond to Webhook',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [480, -32],
    })
    RespondToWebhook = {
        respondWith: 'json',
        responseBody: '={{ { "added": $input.all().length } }}',
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.Webhook.out(0).to(this.Products.in(0));
        this.Products.out(0).to(this.AppendToCatalog.in(0));
        this.AppendToCatalog.out(0).to(this.RespondToWebhook.in(0));
    }
}
