const { Schema, model } = require("mongoose");

const materials = new Schema(
  {
    id_teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    id_student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    languages: [
      {
        idiom: {
          type: String,
          required: true,
        },
        kids: {
          type: Boolean,
          default: false,
        },
        material: [
          {
            level_material: {
              type: String,
              required: true,
            },
            levels_materials: [
              {
                name_material: {
                  type: String,
                  default: "not name",
                },
                link_material: {
                  type: String,
                  default: "not url",
                },
                type_Material: {
                  type: Schema.Types.ObjectId,
                  ref: "TypeMaterial",
                },
                date_upload: {
                  type: String,
                  default: () => {
                    return new Date();
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Materials", materials);
