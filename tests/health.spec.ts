import test, { expect } from "@playwright/test";
import z from "zod";

test("Health check", async ({ request }) => {
    const response = await request.get("/health");
    expect(response.status()).toBe(200);
    z.object({
        status: z.string("ok"),
        uptime: z.number()
    }).safeParse(response.json());
});
