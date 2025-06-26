import * as OBF from "@thatopen/components-front";
import * as OBC from "@thatopen/components";

export function markerCast(components: OBC.Components,world: OBC.World){
    const marker = components.get(OBF.Marker);
    const casters = components.get(OBC.Raycasters);
    const caster = casters.get(world);

    return { marker, caster }
}