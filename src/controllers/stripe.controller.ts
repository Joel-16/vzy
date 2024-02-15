import { Response, Request, NextFunction } from "express";
import { Service } from "typedi";

import StripeService from "../services/stripe.service";

@Service()
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  callback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sig = req.headers["stripe-signature"];
      await this.stripeService.callback(req.body, sig, next);
      res.customSuccess(200);
    } catch {
      next();
    }
  };
}
