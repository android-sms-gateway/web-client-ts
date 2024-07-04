import express from "express";

export const router = express.Router();

router.use(express.json());

router.use('/webhooks', require('./webhooks').router)
