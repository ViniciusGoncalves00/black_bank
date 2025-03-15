import * as THREE from 'three';

export class Carrousel {
    public Objects: THREE.Object3D[] = [];
    public Distance: number = 0;

    public constructor(objects: THREE.Object3D[], distance: number) {
        this.Objects = objects;
        this.Distance = distance;

        for (let index = 0; index < this.Objects.length; index++) {
            this.Objects[index].position.x = this.Distance * index;
        }
    }

    public Rotate(direction: number, index_offset: number = 1): void {
        const objects: THREE.Object3D[] = new Array(this.Objects.length);

        for (let original_index = 0; original_index < this.Objects.length; original_index++) {
            let new_index = (original_index + index_offset * direction + this.Objects.length) % this.Objects.length;
            objects[new_index] = this.Objects[original_index];
        }

        for (let i = 0; i < objects.length; i++) {
            objects[i].position.x = this.Distance * i;
        }

        this.Objects = objects;
    }
}
