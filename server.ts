import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

// Initialize Firebase Admin
const configPath = path.join(process.cwd(), "firebase-applet-config.json");
let appletConfig = { projectId: "", firestoreDatabaseId: "(default)" };
if (fs.existsSync(configPath)) {
  appletConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

const firebaseApp = initializeApp({ 
  credential: applicationDefault(),
  projectId: appletConfig.projectId 
});
const db = getFirestore(firebaseApp, appletConfig.firestoreDatabaseId);

const INITIAL_PRODUCTS = [
  {
    id: "1",
    sku: "TEE-WHT-ESS",
    name: "Classic White Essential",
    price: 35.00,
    stock: 145,
    category: "T-Shirts",
    status: "published",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    description: "The perfect everyday tee. Crafted from 100% organic cotton for ultimate comfort and breathability.",
    sizes: ["S", "M", "L", "XL"],
    isBestseller: true
  },
  {
    id: "2",
    sku: "TEE-BLK-CRW",
    name: "Midnight Black Crew",
    price: 35.00,
    stock: 82,
    category: "T-Shirts",
    status: "published",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800",
    description: "A dark, versatile staple. Tailored fit that looks sharp layered or on its own.",
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: "3",
    sku: "TEE-GRY-VIN",
    name: "Vintage Heather Gray",
    price: 38.00,
    stock: 12,
    category: "T-Shirts",
    status: "published",
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=800",
    description: "Pre-washed for a perfectly worn-in feel. Our heather gray tee features a super-soft tri-blend fabric.",
    sizes: ["S", "M", "L", "XL"],
    isNew: true
  },
  {
    id: "4",
    sku: "TEE-NVY-STD",
    name: "Deep Navy Standard",
    price: 35.00,
    stock: 0,
    category: "T-Shirts",
    status: "draft",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800",
    description: "A sophisticated alternative to black. Rich, fade-resistant color with reinforced stitching.",
    sizes: ["S", "M", "L"]
  },
  {
    id: "5",
    sku: "TEE-BRN-ERT",
    name: "Earth Tone Brown",
    price: 40.00,
    stock: 45,
    category: "T-Shirts",
    status: "published",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800",
    description: "Warm and grounded. This heavyweight cotton tee offers durability and a structured drape.",
    sizes: ["M", "L", "XL"]
  },
  {
    id: "6",
    sku: "TEE-MIN-GRA",
    name: "Urban Minimal Graphic",
    price: 45.00,
    stock: 60,
    category: "Streetwear",
    status: "published",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800",
    description: "A subtle, artistic take on the basic tee. Features a minimalist line-art design on the back.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    isBestseller: true
  },
  {
    id: "7",
    sku: "TEE-SGE-OVS",
    name: "Sage Oversized Heavyweight",
    price: 42.00,
    stock: 35,
    category: "Streetwear",
    status: "published",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
    description: "Cut from ultra-dense 300GSM organic cotton. Feature a dropped shoulder and structured unisex fit in beautiful dusty desert sage.",
    sizes: ["S", "M", "L", "XL"],
    isNew: true
  },
  {
    id: "8",
    sku: "TEE-SAN-STR",
    name: "Sand Dune Striped Tee",
    price: 38.50,
    stock: 55,
    category: "T-Shirts",
    status: "published",
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=800",
    description: "Nostalgic double-stripe yarn dyed aesthetic. Exceptionally soft handle, knit with combed long-staple cotton.",
    sizes: ["M", "L", "XL"]
  },
  {
    id: "9",
    sku: "TEE-WHT-GEO",
    name: "Architectural Geo Line",
    price: 48.00,
    stock: 28,
    category: "Streetwear",
    status: "published",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800",
    description: "Featuring a screenprinted abstract geometric grid on the chest. Designed in collaboration with Tokyo-based studio Unit-9.",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "10",
    sku: "TEE-OLI-UTL",
    name: "Olive Utility Pocket Tee",
    price: 40.00,
    stock: 72,
    category: "Streetwear",
    status: "published",
    image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&q=80&w=800",
    description: "Reinforced patch pocket at chest with custom brass-grommet lanyard detail. Built for everyday rugged premium wear.",
    sizes: ["M", "L", "XL"]
  },
  {
    id: "11",
    sku: "TEE-TER-WAS",
    name: "Terracotta Pigment Wash",
    price: 44.00,
    stock: 19,
    category: "Streetwear",
    status: "published",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800",
    description: "Pigment dyed to create a unique vintage character that softens and fades beautifully with time. Relaxed box fit.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "12",
    sku: "TEE-CRM-WFL",
    name: "Cream Waffle Knit Tee",
    price: 39.00,
    stock: 90,
    category: "T-Shirts",
    status: "published",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800",
    description: "Thermal structured cream knit. Breathable double-face textured weave, ideal for effortless layering in mild climates.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "13",
    sku: "TEE-PRP-HZE",
    name: "Purple Hazel Distressed",
    price: 46.00,
    stock: 14,
    category: "Streetwear",
    status: "published",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800",
    description: "Hand-distressed collar and hem lines with micro-abrasions. Offers a curated, lived-in edge directly from our couture collection.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "14",
    sku: "TEE-CHR-MNT",
    name: "Charcoal Mountain Print",
    price: 45.00,
    stock: 40,
    category: "Streetwear",
    status: "published",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    description: "Back-printed topo-graphic mountain illustration in eco-friendly water-based rubber inks on a faded charcoal body.",
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: "15",
    sku: "TEE-BUT-CRB",
    name: "Buttercream Ribbed Tee",
    price: 36.00,
    stock: 105,
    category: "T-Shirts",
    status: "published",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800",
    description: "Fitted ribbed-blend jersey material. Keeps its snug comfort and recovery, highlighted with simple matching coverstitch seams.",
    sizes: ["S", "M", "L"]
  },
  {
    id: "16",
    sku: "TEE-SLA-BOX",
    name: "Slate Blue Boxy Cut",
    price: 37.00,
    stock: 66,
    category: "T-Shirts",
    status: "published",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=800",
    description: "Classic midweight profile with slightly higher neckline and structured sleeves. Excellent drape characteristics.",
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: "17",
    sku: "TEE-FLA-RED",
    name: "Flame Red Active Tee",
    price: 35.00,
    stock: 80,
    category: "T-Shirts",
    status: "published",
    image: "https://images.unsplash.com/photo-1503341504253-d2e5e5077b17?auto=format&fit=crop&q=80&w=800",
    description: "Energetic vermillion dye tone. Made from super-soft 100% long-staple combed cotton for daily activities.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "18",
    sku: "TEE-RAW-NAT",
    name: "Raw Unbleached Cotton",
    price: 42.00,
    stock: 25,
    category: "T-Shirts",
    status: "published",
    image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80&w=800",
    description: "Zero dyes or processing chemicals. Highlights the organic beauty of cotton in its purest form, featuring raw seed speckles.",
    sizes: ["S", "M", "L", "XL", "XXL"]
  }
];

let localProducts = [...INITIAL_PRODUCTS];
let localOrders: any[] = [];
let useLocalFallback = false;

async function seedData() {
  try {
    const productsRef = db.collection("products");
    console.log("Checking and seeding missing products into Firestore...");
    for (const product of INITIAL_PRODUCTS) {
      const docRef = productsRef.doc(product.id);
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        console.log(`Seeding missing product: ${product.name} (ID: ${product.id})`);
        await docRef.set(product);
      }
    }
  } catch (err) {
    console.warn("Failed to seed data into Firestore (using local memory fallback):", (err as Error).message);
    useLocalFallback = true;
  }
}

async function startServer() {
  await seedData();
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);

  // Middleware
  app.use(express.json());

  // --- API Routes ---
  app.get("/api/products", async (req, res) => {
    try {
      if (useLocalFallback) {
        return res.json(localProducts);
      }
      const snapshot = await db.collection("products").get();
      const products = snapshot.docs.map(doc => doc.data());
      res.json(products);
    } catch (e) {
      console.warn("Firestore error on GET /api/products, falling back to local memory:", (e as Error).message);
      useLocalFallback = true;
      res.json(localProducts);
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      if (useLocalFallback) {
        const prod = localProducts.find(p => p.id === req.params.id);
        if (!prod) return res.status(404).json({ error: "Product not found" });
        return res.json(prod);
      }
      const doc = await db.collection("products").doc(req.params.id).get();
      if (!doc.exists) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(doc.data());
    } catch (e) {
      console.warn("Firestore error on GET /api/products/:id, falling back to local memory:", (e as Error).message);
      useLocalFallback = true;
      const prod = localProducts.find(p => p.id === req.params.id);
      if (!prod) return res.status(404).json({ error: "Product not found" });
      res.json(prod);
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const id = Math.random().toString(36).substr(2, 9);
      const newProduct = { id, ...req.body };
      if (useLocalFallback) {
        localProducts.push(newProduct);
        return res.json(newProduct);
      }
      await db.collection("products").doc(id).set(newProduct);
      res.json(newProduct);
    } catch (e) {
      console.warn("Firestore error on POST /api/products, falling back to local memory:", (e as Error).message);
      useLocalFallback = true;
      const id = Math.random().toString(36).substr(2, 9);
      const newProduct = { id, ...req.body };
      localProducts.push(newProduct);
      res.json(newProduct);
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      if (useLocalFallback) {
        const idx = localProducts.findIndex(p => p.id === req.params.id);
        if (idx === -1) return res.status(404).json({ error: "Product not found" });
        localProducts[idx] = { ...localProducts[idx], ...req.body };
        return res.json(localProducts[idx]);
      }
      await db.collection("products").doc(req.params.id).update(req.body);
      const updated = await db.collection("products").doc(req.params.id).get();
      res.json(updated.data());
    } catch (e) {
      console.warn("Firestore error on PUT /api/products/:id, falling back to local memory:", (e as Error).message);
      useLocalFallback = true;
      const idx = localProducts.findIndex(p => p.id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: "Product not found" });
      localProducts[idx] = { ...localProducts[idx], ...req.body };
      res.json(localProducts[idx]);
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      if (useLocalFallback) {
        localProducts = localProducts.filter(p => p.id !== req.params.id);
        return res.json({ success: true });
      }
      await db.collection("products").doc(req.params.id).delete();
      res.json({ success: true });
    } catch (e) {
      console.warn("Firestore error on DELETE /api/products/:id, falling back to local memory:", (e as Error).message);
      useLocalFallback = true;
      localProducts = localProducts.filter(p => p.id !== req.params.id);
      res.json({ success: true });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      if (useLocalFallback) {
        return res.json([...localOrders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
      const snapshot = await db.collection("orders").orderBy("date", "desc").get();
      const orders = snapshot.docs.map(doc => doc.data());
      res.json(orders);
    } catch (e) {
      console.warn("Firestore error on GET /api/orders, falling back to local memory:", (e as Error).message);
      useLocalFallback = true;
      res.json([...localOrders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      if (useLocalFallback) {
        const order = localOrders.find(o => o.id === req.params.id.trim());
        if (!order) return res.status(404).json({ error: "Order not found" });
        return res.json(order);
      }
      const doc = await db.collection("orders").doc(req.params.id.trim()).get();
      if (!doc.exists) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(doc.data());
    } catch (e) {
      console.warn("Firestore error on GET /api/orders/:id, falling back to local memory:", (e as Error).message);
      useLocalFallback = true;
      const order = localOrders.find(o => o.id === req.params.id.trim());
      if (!order) return res.status(404).json({ error: "Order not found" });
      res.json(order);
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      if (useLocalFallback) {
        const idx = localOrders.findIndex(o => o.id === req.params.id);
        if (idx === -1) return res.status(404).json({ error: "Order not found" });
        localOrders[idx].status = req.body.status;
        return res.json(localOrders[idx]);
      }
      await db.collection("orders").doc(req.params.id).update({ status: req.body.status });
      const updated = await db.collection("orders").doc(req.params.id).get();
      res.json(updated.data());
    } catch (e) {
      console.warn("Firestore error on PUT /api/orders/:id/status, falling back to local memory:", (e as Error).message);
      useLocalFallback = true;
      const idx = localOrders.findIndex(o => o.id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: "Order not found" });
      localOrders[idx].status = req.body.status;
      res.json(localOrders[idx]);
    }
  });

  app.get("/api/analytics", async (req, res) => {
    try {
      if (useLocalFallback) {
        const validOrders = localOrders.filter(o => ["completed", "processing"].includes(o.status));
        const totalRevenue = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        const lowStockCount = localProducts.filter(p => (p.stock || 0) < 15).length;
        return res.json({
          revenue: totalRevenue,
          orders: validOrders.length,
          products: localProducts.length,
          lowStock: lowStockCount
        });
      }
      const ordersSnap = await db.collection("orders").where("status", "in", ["completed", "processing"]).get();
      let totalRevenue = 0;
      let completedOrders = ordersSnap.size;
      ordersSnap.forEach(doc => {
        totalRevenue += doc.data().total || 0;
      });

      const productsSnap = await db.collection("products").get();
      const totalProducts = productsSnap.size;
      let lowStockCount = 0;
      productsSnap.forEach(doc => {
        if ((doc.data().stock || 0) < 15) {
          lowStockCount++;
        }
      });

      res.json({
        revenue: totalRevenue,
        orders: completedOrders,
        products: totalProducts,
        lowStock: lowStockCount
      });
    } catch (e) {
      console.warn("Firestore error on GET /api/analytics, falling back to local memory:", (e as Error).message);
      useLocalFallback = true;
      const validOrders = localOrders.filter(o => ["completed", "processing"].includes(o.status));
      const totalRevenue = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const lowStockCount = localProducts.filter(p => (p.stock || 0) < 15).length;
      res.json({
        revenue: totalRevenue,
        orders: validOrders.length,
        products: localProducts.length,
        lowStock: lowStockCount
      });
    }
  });

  app.post("/api/checkout", async (req, res) => {
    const { items, customer } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newOrder = {
      id: orderId,
      items,
      customer,
      date: new Date().toISOString(),
      status: "processing",
      total: req.body.total || items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    };

    try {
      if (useLocalFallback) {
        localOrders.push(newOrder);
        // Decrement local stock
        for (const item of items) {
          const prod = localProducts.find(p => p.name === item.name);
          if (prod) {
            prod.stock = Math.max(0, prod.stock - item.quantity);
          }
        }
        return res.json({ 
          success: true, 
          orderId,
          message: "Order placed successfully! (Local memory fallback)" 
        });
      }

      await db.collection("orders").doc(orderId).set(newOrder);

      // Decrement stock for products 
      const batch = db.batch();
      for (const item of items) {
        const snap = await db.collection("products").where("name", "==", item.name).limit(1).get();
        if (!snap.empty) {
          const doc = snap.docs[0];
          batch.update(doc.ref, { stock: Math.max(0, doc.data().stock - item.quantity) });
        }
      }
      await batch.commit();
      
      setTimeout(() => {
        res.json({ 
          success: true, 
          orderId,
          message: "Order placed successfully!" 
        });
      }, 1000);
    } catch (e) {
      console.warn("Firestore error on POST /api/checkout, falling back to local memory:", (e as Error).message);
      useLocalFallback = true;
      localOrders.push(newOrder);
      // Decrement local stock
      for (const item of items) {
        const prod = localProducts.find(p => p.name === item.name);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
        }
      }
      res.json({ 
        success: true, 
        orderId,
        message: "Order placed successfully! (Local memory fallback)" 
      });
    }
  });

  // --- Vite Middleware & Static Serving ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
