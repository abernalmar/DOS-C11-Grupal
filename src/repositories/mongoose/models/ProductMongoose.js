import { Schema } from "mongoose";

const ReviewSchema = new Schema(
  {
    title: {
      type: String,
      required: "Kindly enter the title of the review",
    },
    body: {
      type: String,
      required: "Kindly enter the body of the review",
    },
    stars: {
      type: Number,
      required: "Kindly enter the stars for the review",
    },
    _userId: {
      type: Schema.Types.ObjectId,
      required: "Kindly enter the user ID for the review",
      ref: "User",
    },
  },
  {
    virtuals: {
      userId: {
        get() {
          return this._userId.toString();
        },
        set(userId) {
          this._userId = userId;
        },
      },
    },
    strict: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret, options) {
        ret.id = ret._id; // Cambia _id a id
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: "Kindly enter the name",
    },
    description: {
      type: String,
      required: "Kindly enter the description",
    },
    price: {
      type: Number,
      required: "Kindly enter the price",
    },
    image: {
      type: String,
    },
    order: {
      type: Number,
      required: "Kindly enter the order",
    },
    availability: {
      type: Boolean,
      required: "Kindly enter the availability",
    },
    reviews: [ReviewSchema],

    _productCategoryId: {
      type: Schema.Types.ObjectId,
      required: "Kindly enter the product category",
      ref: "ProductCategory",
    },
  },
  {
    virtuals: {
      productCategoryId: {
        get() {
          return this._productCategoryId.toString();
        },
        set(productCategoryId) {
          this._productCategoryId = productCategoryId;
        },
      },
      restaurantId: {
        get() {
          return this.ownerDocument()._id.toString();
        },
      },

      avgStars: {
        get() {
          if (this.reviews.length === 0) {
            return null;
          }
          const totalStars = this.reviews.reduce(
            (acc, review) => acc + review.stars,
            0
          );
          const averageStars = totalStars / this.reviews.length;

          // Redondea el promedio a 1 decimal
          return parseFloat(averageStars.toFixed(1));
        },
      },
    },
    strict: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, resultObject, options) {
        delete resultObject._id;
        delete resultObject.__v;
        delete resultObject._productCategoryId;
        return resultObject;
      },
    },
  }
);
// Middleware para actualizar avgStars cuando se elimina una revisión
ProductSchema.post("findOneAndUpdate", async function (doc) {
  // Verificar si la revisión fue eliminada
  if (doc._update.$pull && doc._update.$pull.reviews) {
    const product = await ProductMongoose.findById(doc._id);
    // Verificar si el producto tiene una única revisión
    if (product.reviews.length === 0) {
      product.avgStars = null; // Actualizar avgStars a null
      await product.save(); // Guardar el producto actualizado
    }
  }
});

ProductSchema.virtual("productCategory", {
  ref: "ProductCategory",
  localField: "_productCategoryId",
  foreignField: "_id",
});

export default ProductSchema;
