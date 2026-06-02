import { z } from "zod";
import { CITIES, SERVICES } from "./constants";

/**
 * Український номер телефону:
 *   +380XXXXXXXXX  (12 цифр після +)
 *   або 0XXXXXXXXX (10 цифр)
 */
const PHONE_RE = /^(?:\+?380\d{9}|0\d{9})$/;

/** Люди часто вводять номер з пробілами/дужками/дефісами ("099 608 40 68").
 *  Прибираємо все зайве перед перевіркою та збереженням. */
const normalizePhone = (v: string): string => v.replace(/[\s()\-.]/g, "");

/** Спільна схема телефону: нормалізує, потім валідує. */
const phoneSchema = z
  .string()
  .trim()
  .transform(normalizePhone)
  .refine((v) => PHONE_RE.test(v), "Формат: 0XXXXXXXXX або +380XXXXXXXXX");

export const leadFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Введіть ім'я (мінімум 2 символи)")
    .max(80, "Занадто довге ім'я"),
  phone: phoneSchema,
  email: z
    .string()
    .trim()
    .email("Невірний формат e-mail")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || val === "Інше" || CITIES.some((c) => c.nameUk === val),
      "Оберіть місто зі списку",
    ),
  service: z
    .string()
    .optional()
    .refine(
      (val) => !val || SERVICES.some((s) => s.slug === val),
      "Оберіть послугу зі списку",
    ),
  message: z
    .string()
    .trim()
    .min(30, "Опишіть ситуацію детальніше (мінімум 30 символів)")
    .max(2000, "Скоротіть повідомлення (макс. 2000 символів)"),
  consent: z.literal(true, {
    message: "Необхідна згода з документами",
  }),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

/**
 * Payload що йде на /api/leads. Додатково містить UTM-параметри.
 */
export const leadApiSchema = leadFormSchema.extend({
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

export type LeadApiPayload = z.infer<typeof leadApiSchema>;

/**
 * Схема заявки адвоката-партнера → /api/lawyer-applications
 */
export const lawyerApplicationSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(5, "Введіть ПІБ (мінімум 5 символів)")
    .max(120, "Занадто довге ПІБ"),
  email: z
    .string()
    .trim()
    .email("Невірний формат e-mail"),
  phone: phoneSchema,
  city: z
    .string()
    .trim()
    .min(2, "Вкажіть місто"),
  naau_certificate: z
    .string()
    .trim()
    .min(4, "Вкажіть номер свідоцтва НААУ"),
  years_practice: z
    .number({ error: "Вкажіть стаж" })
    .int()
    .min(0, "Некоректне значення")
    .max(50, "Некоректне значення"),
  specializations: z
    .array(z.string())
    .min(1, "Оберіть хоча б одну спеціалізацію"),
  monthly_capacity: z.number().int().min(1).max(100).optional(),
  has_military_practice: z.boolean().optional(),
  comment: z.string().trim().max(2000).optional(),
  consent: z.literal(true, { message: "Необхідна згода" }),
});

export type LawyerApplicationValues = z.infer<typeof lawyerApplicationSchema>;
