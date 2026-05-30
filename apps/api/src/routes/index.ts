import { Router } from "express";
import { cartItemSchema, checkoutSchema, loginSchema, productInputSchema, productQuerySchema, registerSchema, statusSchema } from "@marketplace/shared";
import * as authController from "../controllers/auth.controller.js";
import * as productController from "../controllers/product.controller.js";
import * as cartController from "../controllers/cart.controller.js";
import * as wishlistController from "../controllers/wishlist.controller.js";
import * as orderController from "../controllers/order.controller.js";
import * as adminController from "../controllers/admin.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateBody, validateQuery } from "../middleware/validate.js";

const router = Router();

router.get("/health", (_req, res) => res.json({ ok: true, service: "marketplace-api" }));
router.post("/auth/register", validateBody(registerSchema), asyncHandler(authController.register));
router.post("/auth/login", validateBody(loginSchema), asyncHandler(authController.login));
router.post("/auth/refresh", asyncHandler(authController.refresh));
router.post("/auth/logout", authenticate, asyncHandler(authController.logout));
router.get("/auth/me", authenticate, asyncHandler(authController.me));

router.get("/products", validateQuery(productQuerySchema), asyncHandler(productController.index));
router.get("/products/:id", asyncHandler(productController.show));

router.use("/cart", authenticate, authorize("customer", "seller", "admin"));
router.get("/cart", asyncHandler(cartController.index));
router.post("/cart", validateBody(cartItemSchema), asyncHandler(cartController.upsert));
router.patch("/cart/:productId", validateBody(cartItemSchema.omit({ productId: true })), asyncHandler(cartController.upsert));
router.delete("/cart/:productId", asyncHandler(cartController.remove));

router.use("/wishlist", authenticate, authorize("customer", "seller", "admin"));
router.get("/wishlist", asyncHandler(wishlistController.index));
router.post("/wishlist", validateBody(cartItemSchema.pick({ productId: true })), asyncHandler(wishlistController.add));
router.delete("/wishlist/:productId", asyncHandler(wishlistController.remove));

router.use("/orders", authenticate, authorize("customer", "seller", "admin"));
router.get("/orders", asyncHandler(orderController.mine));
router.post("/orders", validateBody(checkoutSchema), asyncHandler(orderController.create));

router.use("/seller", authenticate, authorize("seller", "admin"));
router.get("/seller/products", asyncHandler(productController.sellerIndex));
router.post("/seller/products", validateBody(productInputSchema), asyncHandler(productController.create));
router.patch("/seller/products/:id", validateBody(productInputSchema.partial()), asyncHandler(productController.update));
router.delete("/seller/products/:id", asyncHandler(productController.destroy));
router.get("/seller/orders", asyncHandler(orderController.sellerIndex));
router.patch("/seller/orders/:id", validateBody(statusSchema), asyncHandler(orderController.updateStatus));

router.use("/admin", authenticate, authorize("admin"));
router.get("/admin/stats", asyncHandler(adminController.stats));
router.get("/admin/users", asyncHandler(adminController.users));
router.patch("/admin/users/:id/suspend", asyncHandler(adminController.suspend));
router.get("/admin/products", asyncHandler(adminController.products));
router.delete("/admin/products/:id", asyncHandler(adminController.removeProduct));
router.get("/admin/orders", asyncHandler(adminController.orders));

export default router;
