import { Router, Request, Response } from "express";

const router = Router();

/**
 * 1. GET / -> "ok"
 * Ders içi temel kök rota yönergesi
 */
router.get("/", (req: Request, res: Response) => {
  res.status(200).send("ok");
});

/**
 * 2. GET /hello -> "Hello, World!"
 * Statik selamlama rotası
 */
router.get("/hello", (req: Request, res: Response) => {
  res.status(200).send("Hello, World!");
});

/**
 * 3. GET /hello/:name -> "Hello, {name}!"
 * Dinamik parametreli selamlama rotası (Örn: /hello/emre -> "Hello, Emre!")
 */
router.get("/hello/:name", (req: Request, res: Response) => {
  const name = String(req.params.name || "");
  const capitalized = name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
  res.status(200).send(`Hello, ${capitalized}!`);
});

/**
 * 4. GET /sum/:number1/:number2 -> Toplam sonucu
 * İki sayı parametresini toplayıp sonucu metin olarak döndürür
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
