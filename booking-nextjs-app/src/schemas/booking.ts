import { z } from "zod";

export const bookingSchema = z
  .object({
    fromCity: z
      .object({
        id: z.string(),
        name: z
          .string()
          .min(1, "Это поле обязательно")
          .regex(/^[А-Яа-яA-Za-z\s-]+$/, "Допустимы только буквы"),
      })
      .nullable()
      .refine((val) => val !== null, { message: "Это поле обязательно" }),

    toCity: z
      .object({
        id: z.string(),
        name: z
          .string()
          .min(1, "Это поле обязательно")
          .regex(/^[А-Яа-яA-Za-z\s-]+$/, "Допустимы только буквы"),
      })
      .nullable()
      .refine((val) => val !== null, { message: "Это поле обязательно" }),

    departureDate: z.date({
      required_error: "Это поле обязательно",
      invalid_type_error: "Неверный формат даты",
    }).nullable(),

    returnDate: z.date({
      required_error: "Это поле обязательно",
      invalid_type_error: "Неверный формат даты",
    }).nullable().optional(),

    isOneWay: z.boolean(),

    fromAirport: z.object({
      id: z.string(),
      name: z.string(),
      code: z.string(),
    }).nullable()
    .refine((val) => val !== null, { message: "Это поле обязательно" }),

    toAirport: z.object({
      id: z.string(),
      name: z.string(),
      code: z.string(),
    }).nullable()
    .refine((val) => val !== null, { message: "Это поле обязательно" }),

    classType: z.object({
      id: z.string(),
      name: z.string(),
    }).nullable()
    .refine((val) => val !== null, { message: "Это поле обязательно" }),

    passengers: z.object({
      Взрослые: z.number(),
      Дети: z.number(),
      Младенцы: z.number(),
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.departureDate) {
      ctx.addIssue({
        path: ["departureDate"],
        code: z.ZodIssueCode.custom,
        message: "Это поле обязательно",
      });
    }

    if (!data.isOneWay) {
      if (!data.returnDate) {
        ctx.addIssue({
          path: ["returnDate"],
          code: z.ZodIssueCode.custom,
          message: "Это поле обязательно",
        });
      } 
      else if (data.departureDate && data.returnDate < data.departureDate) {
        ctx.addIssue({
          path: ["returnDate"],
          code: z.ZodIssueCode.custom,
          message: "Дата возвращения не может быть раньше даты отправления",
        });
      }
    }
  });