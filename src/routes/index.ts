import { Router } from "express";
import Container from "typedi";

import { AccountController } from "../controllers/account.controller";
import { StripeController } from "../controllers/stripe.controller";
import { authorizationMiddleware } from "../middleware/checkJwt";
import { validatorLogin, validatorRegister, validatorEditProfile } from "../middleware/validation";

const accountController = Container.get(AccountController);
const stripeController = Container.get(StripeController);
const router = Router();

router.post("/login", [validatorLogin], accountController.login);
router.post("/register", [validatorRegister], accountController.register);
router.patch("/profile", [authorizationMiddleware, validatorEditProfile], accountController.editProfile);
router.get("/profile", [authorizationMiddleware], accountController.getProfile);

router.post("/stripe/callback", stripeController.callback);

export default router;
