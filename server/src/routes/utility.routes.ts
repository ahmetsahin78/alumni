import { Router, Request, Response } from "express";

const router = Router();

/**
 * GET /hello/:name
 * Returns greeting message: "Hello,{name}!"
 */
router.get("/hello/:name", (req: Request, res: Response) => {
  const { name } = req.params;
  res.status(200).send(`Hello,${name}!`);
});

/**
 * GET /sum/:number1/:number2
 * Returns sum of two numbers
 */
router.get("/sum/:number1/:number2", (req: Request, res: Response) => {
  const n1 = Number(req.params.number1);
  const n2 = Number(req.params.number2);

  if (isNaN(n1) || isNaN(n2)) {
    res.status(400).send("Geçersiz sayı parametreleri.");
    return;
  }

  res.status(200).send(`${n1 + n2}`);
});

export default router;
