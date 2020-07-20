// mod.ts is entry point of project. Naming comes from RUST
import { join } from "../depts.ts";
import { BufReader } from "../depts.ts";
import { parse } from "../depts.ts";
import { pick } from "../depts.ts";

// Type safety
// interface Planet {
//   [ key: string ] : string
// }

type Planet = Record<string, string>;

let planets : Array<Planet>;

export function filterHabitablePlanets(planets: Array<Planet>) {
  return planets.filter(planet => {
    const plantaryRadius = Number(planet["koi_prad"]);
    const stellarMass = Number(planet["koi_smass"]);
    const stellarRadius = Number(planet["koi_srad"]);
    return planet["koi_disposition"] === 'CONFIRMED' && plantaryRadius > 0.5 && plantaryRadius < 1.5 && stellarMass > 0.78 && stellarMass < 1.04 && stellarRadius > 0.99 && stellarRadius < 1.01;
  });
}

async function loadPlanetsData() {
  // Builds correct path for any operating system
  const path = join("data", "kepler_exoplanets.csv");
  // C:\WINDOWS\system32
  // /usr/bin
  // Always close over using open!
  const file = await Deno.open(path);
  const bufReader = new BufReader(file);
  const result = await parse(bufReader, {
    header: true,
    comment: "#"
  });
  Deno.close(file.rid);

  // const planets = (result as Array<Planet>).filter(planet => {
  //   const plantaryRadius = Number(planet["koi_prad"]);
  //   const stellarMass = Number(planet["koi_smass"]);
  //   const stellarRadius = Number(planet["koi_srad"]);
  //   return planet["koi_disposition"] === 'CONFIRMED' && plantaryRadius > 0.5 && plantaryRadius < 1.5 && stellarMass > 0.78 && stellarMass < 1.04 && stellarRadius > 0.99 && stellarRadius < 1.01;
  // });

  const planets = filterHabitablePlanets(result as Array<Planet>);

  return planets.map(planet => {
    return pick(planet, [
      "koi_prad",
      "koi_smass",
      "koi_srad",
      "kepler_name",
      "koi_count",
      "koi_steff"
    ])
  });
  /*
  // Lists out all files in current working directory
  for await (const dirEntry of Deno.readDir(Deno.cwd())) {
    log.info(dirEntry.name);
  }
  */
}

planets = await loadPlanetsData();
console.log(`${planets.length} habitable planets`)

export function getAllPlanets() {
  return planets;
}
