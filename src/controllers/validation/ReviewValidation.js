import { check } from "express-validator";

// Restricciones para las estrellas
const starsConstraints = { min: 0, max: 5 };

const create = [
  // Validar el título de la revisión
  check("title")
    .exists()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 1, max: 255 })
    .withMessage("Title must be between 1 and 255 characters"),

  // Validar el cuerpo de la revisión
  check("body")
    .exists()
    .withMessage("Body is required")
    .isString()
    .withMessage("Body must be a string"),

  // Validar las estrellas de la revisión
  check("stars")
    .exists()
    .withMessage("Stars are required")
    .isInt()
    .withMessage("Stars must be an integer")
    .isFloat(starsConstraints)
    .withMessage("Stars must be between 0 and 5"),
];

const update = [
  check("title")
    .exists()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 1, max: 255 })
    .withMessage("Title must be between 1 and 255 characters"),

  // Validar el cuerpo de la revisión
  check("body")
    .exists()
    .withMessage("Body is required")
    .isString()
    .withMessage("Body must be a string"),

  // Validar las estrellas de la revisión
  check("stars")
    .exists()
    .withMessage("Stars are required")
    .isInt()
    .withMessage("Stars must be an integer")
    .isFloat(starsConstraints)
    .withMessage("Stars must be between 0 and 5"),
];

export { create, update };
