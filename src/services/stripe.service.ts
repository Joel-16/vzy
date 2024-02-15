import { NextFunction } from "express";
import { Service } from "typedi";
const stripe = require("stripe")(process.env.STRIPE_SECRETKEY);

import { Account } from "../models/account.model";
import { CustomError } from "../utils/response/custom-error/CustomError";

@Service()
export default class StripeService {
  constructor(private readonly account = Account) {}

  async callback(payload, header, next: NextFunction) {
    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, header, `${process.env.STRIPE_SIGNING}`);
    } catch (err) {
      next(new CustomError(400, "Unauthorised"));
    }
    switch (event.type) {
      case "charge.succeeded":
      case "checkout.session.async_payment_succeeded":
      case "checkout.session.completed":
      case "payment_intent.succeeded":
        await this.account.updateOne({ email: event.data.object.billing_details.email }, { status: "paid" });
        return;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return
  }
}
