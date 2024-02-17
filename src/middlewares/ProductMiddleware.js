import container from "../config/container.js";
const checkProductOwnership = async (req, res, next) => {
  const productService = container.resolve("productService");
  try {
    const belongsToOwner = await productService.checkProductOwnership(
      req.params.productId,
      req.user.id
    );
    if (belongsToOwner) {
      return next();
    } else {
      return res
        .status(403)
        .send("Not enough privileges. This entity does not belong to you");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
const checkReviewOwnership = async (req, res, next) => {
  const reviewService = container.resolve("reviewService");
  try {
    // Obtener el productId y reviewId de los parámetros de la solicitud
    const reviewId = req.params.reviewId;

    // Obtener la revisión del producto
    const review = await reviewService.findById(reviewId);

    // Verificar si el usuario autenticado es el mismo que creó la revisión
    if (review.userId === req.user.id) {
      // El usuario es el propietario de la revisión, permitir el acceso
      return next();
    } else {
      // El usuario no es el propietario de la revisión, devolver un error de permiso
      return res
        .status(403)
        .send("Not enough privileges. You are not the owner of this review");
    }
  } catch (err) {
    // Manejar errores y devolver una respuesta con el código de estado apropiado
    return res.status(500).send(err.message);
  }
};

const checkProductRestaurantOwnership = async (req, res, next) => {
  const productService = container.resolve("productService");
  try {
    const belongsToOwner = await productService.checkProductRestaurantOwnership(
      req.body.restaurantId,
      req.user.id
    );
    if (belongsToOwner) {
      return next();
    } else {
      return res
        .status(403)
        .send("Not enough privileges. This entity does not belong to you");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const checkProductHasNotBeenOrdered = async (req, res, next) => {
  const productService = container.resolve("productService");
  try {
    const hasBeenOrdered = await productService.checkProductHasNotBeenOrdered(
      req.params.productId
    );
    if (hasBeenOrdered) {
      return next();
    } else {
      return res.status(409).send("This product has already been ordered");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export {
  checkProductOwnership,
  checkProductRestaurantOwnership,
  checkProductHasNotBeenOrdered,
  checkReviewOwnership,
};
