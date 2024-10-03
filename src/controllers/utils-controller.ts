import { Request, Response } from "express";
import proj4 from "proj4";
import { sql, poolPromise } from "../dbConfig";
import { Ward } from "../models/Ward";

export const getWard = async (req: Request, res: Response) => {
  const coords = req.params.latlng.split(",");
  const lat = parseFloat(coords[0]);
  const lng = parseFloat(coords[1]);
  const osgb =
    "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs";
  const wgs84 = "+proj=longlat +datum=WGS84 +no_defs ";
  const [easting, northing] = proj4(wgs84, osgb, [lng, lat]);

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("easting", sql.Float, easting)
      .input("northing", sql.Float, northing).query<Ward[]>(`
        DECLARE @p geometry;
        SET @p = geometry::Point(@easting, @northing, 0);
        SELECT * FROM polygons ps WHERE [Type] = 3 AND @p.STIntersects(ps.BoundingBox) = 1 AND @p.STIntersects(ps.Polygon) = 1;`);

    const ward: Ward | undefined = result.recordset.map((row) => ({
      Name: row.Name
    }))[0];

    if (ward) {
      res.json(ward);
    } else {
      res.status(404).send("Ward not found.");
    }
  } catch (err) {
    res.status(500);
  }
};
