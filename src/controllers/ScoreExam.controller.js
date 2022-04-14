const ScoreExam = require("../models/ScoreExam/ScoreExan");
const Student = require("../models/student");
const Course = require("../models/courses");

module.exports = {
  AddScoreExam: async (req, res, next) => {
    console.log(
      "Este el ID: %s del teacher, que viene desde jwt(json web token)",
      req.id
    );
    const { idStudent, level } = req.body;

    const idiom = level[0].idiom,
      kids = level[0].kids,
      name_level = level[0].level[0].name_level,
      name_sublevel = level[0].level[0].subLevel[0].name_sublevel,
      score = level[0].level[0].subLevel[0].score;

    // console.log(JSON.stringify(level));
    // return res.status(200).json({
    //   message: "",
    // });
    try {
      //Second Query
      const ExisteStudent = await ScoreExam.findOne({
        id_student: idStudent,
      });
      if (ExisteStudent) {
        const found = await ScoreExam.findOne({
          Content: {
            $all: [{ $elemMatch: { idiom: idiom, kids: kids } }],
          },
        });

        if (found) {
          //third Query

          const NameLevel = await ScoreExam.findOne({
            id_student: idStudent,
          }).populate("Content");
          let NameLevelFilter = NameLevel.Content.filter(function (elem) {
            return elem.kids == kids && idiom === idiom;
          }).pop();

          if (NameLevelFilter) {
            var SearchLevelRes = SearchLevel(NameLevelFilter, name_level);
            if (SearchLevelRes.access) {
              var SearchSubLevelRes = SearhSubLevel(
                SearchLevelRes.data.subLevel,
                name_sublevel
              );

              if (SearchSubLevelRes.access) {
                return res.status(400).json({
                  message: "No se puede Add more Data here",
                  error: true,
                });
              }
              var datos = {
                name_sublevel: name_sublevel,
                score: score,
                id_teacher: req.id,
              };
              console.log(datos);

              // ############# AQUI SE AGREGA EL NUEVO SUBLEVEL ##################
              await ScoreExam.findOneAndUpdate(
                {
                  id_student: idStudent,
                  "Content.level.name_level": name_level,
                },
                {
                  $push: {
                    "Content.$[idex0].level.$[idex1].subLevel": datos,
                  },
                },
                {
                  new: true,
                  useFindAndModify: false,
                  arrayFilters: [
                    { "idex0.idiom": idiom, "idex0.kids": kids },
                    { "idex1.name_level": name_level },
                  ],
                }
              );
              return res.status(200).json({
                message: "Add score sublevel",
                error: false,
                success: true,
              });
            }
            // ###########   AQUI SE AGREGA UN NUEVO LEVEL CON SU SUBLEVEL Y SU SCORE ############
            await ScoreExam.findOneAndUpdate(
              {
                id_student: idStudent,
                "Content.idiom": idiom,
                "Content.kids": kids,
              },
              {
                $push: {
                  "Content.$.level": {
                    name_level: name_level,
                    subLevel: [
                      {
                        name_sublevel: name_sublevel,
                        score: score,
                      },
                    ],
                  },
                },
              }
            );
            return res.status(200).json({
              message: "Add new Level con su score",
              error: false,
              success: true,
            });
          }
        }

        console.log("New Content");

        await ScoreExam.findOneAndUpdate(
          {
            id_student: idStudent,
          },
          {
            $push: {
              Content: {
                kids: kids,
                idiom: idiom,
                level: [
                  {
                    name_level: name_level,
                    subLevel: [
                      {
                        name_sublevel: name_sublevel,
                        score: score,
                      },
                    ],
                  },
                ],
              },
            },
          }
        );

        return res.status(200).json({
          message: "Add new level con su idiom",
        });
      }

      const newScoreExam = new ScoreExam({
        id_student: idStudent,
        Content: level,
        id_teacher: req.id,
      });

      await newScoreExam.save();

      return res.status(200).json({
        message: "Add new Score exam",
        success: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({});
    }
    // return res.status(200).json({});
  },
  //
  UpdateScore: async (req, res, next) => {
    console.log(
      "Este el ID: %s del teacher, que viene desde jwt(json web token)",
      req.id
    );
    const { idStudent, level } = req.body;
    const idiom = level[0].idiom,
      kids = level[0].kids,
      name_level = level[0].level[0].name_level,
      name_sublevel = level[0].level[0].subLevel[0].name_sublevel,
      score = level[0].level[0].subLevel[0].score,
      date = level[0].level[0].subLevel[0].Date;

    console.log(JSON.stringify(level));
    let datefinally = date;
    if (!date) datefinally = new Date();
    try {
      const updated = await ScoreExam.findOneAndUpdate(
        {
          id_student: idStudent,
          "Content.level.name_level": name_level,
        },
        {
          $set: {
            "Content.$[idex0].level.$[idex1].subLevel.$[index2].score": score,
            "Content.$[idex0].level.$[idex1].subLevel.$[index2].Date":
              datefinally,
          },
        },
        {
          new: true,
          useFindAndModify: false,
          arrayFilters: [
            { "idex0.idiom": idiom, "idex0.kids": kids },
            { "idex1.name_level": name_level },
            { "index2.name_sublevel": name_sublevel },
          ],
        }
      );
      if (!updated)
        return res.status(400).json({
          error: true,
          message: "Not Updated",
        });
      return res.status(200).json({
        success: true,
        error: false,
        message: "All good",
      });
    } catch (err) {
      console.log(err);
      return res.status(500);
    }
  },
  GetScore: async (req, res, next) => {
    const { id_student } = req.params;
    console.log(
      "Este es el ID  des estudent: %s que fue pasado por parametro",
      id_student
    );
    if (!id_student)
      return res
        .status(400)
        .json({ success: false, error: true, message: "Id not found/null" });
    try {
      const data = await ScoreExam.findOne({ id_student: id_student });
      // aqui pasa el id del student

      // console.log(data);
      // if (!data)
      //   return res.status(200).json({
      //     message: "All Good",
      //     success: true,
      //     data: {
      //       scoreExam: data,
      //     },
      //   });
      console.log(data);
      return res.status(200).json({
        message: "All Good",
        success: true,
        data: {
          scoreExam: data,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({});
    }
  },
};

const SearchLevel = (NameLevelFilter, nameLevel) => {
  // console.log("LEVEL:" + NameLevelFilter);
  var LevelFilter = NameLevelFilter.level
    .filter((e) => e.name_level == nameLevel)
    .pop();
  console.log("Level Found: " + LevelFilter);
  if (!LevelFilter) return false;
  return {
    data: LevelFilter,
    access: true,
  };
};

const SearhSubLevel = (Array, name_sublevel) => {
  // console.log(Array);
  var SubLEvelFilter = Array.filter(
    (e) => e.name_sublevel === name_sublevel
  ).pop();
  // console.log(name_sublevel);
  if (!SubLEvelFilter) return false;
  return {
    data: SubLEvelFilter,
    access: true,
  };
};
