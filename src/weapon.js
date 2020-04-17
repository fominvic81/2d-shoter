import { Body, Bodies } from 'matter-js';
import { draw } from './sprite.js';

export const weapon = (level, options, sprites, body, resize) => {
    return {
        level: level,
        name: options.name,
        fireAnimation: options.fireAnimation,
        rechargeTime: options.rechargeTime,
        capacity: options.capacity,
        timeBetweenShots: options.timeBetweenShots,
        knockback: options.knockback,
        attackClass: options.attackClass,
        image: options.image,
        x: options.x,
        y: options.y,
        angle: options.angle,
        maxZoom: options.maxZoom,
        width: options.width,
        height: options.height,
        projectilesCount: options.capacity,
        shotTimer: 0,
        rechargeTimer: 0,
        isRecharging: false,
        sprites: sprites,
        body: body,
        resize: resize,
        zoom: options.maxZoom,

        update (dt) {
            this.shotTimer += dt;
            if (this.isRecharging) {
                this.rechargeTimer += dt;
            }
            if (this.rechargeTimer >= this.rechargeTime) {
                this.rechargeTimer = 0;
                this.isRecharging = false;
                this.projectilesCount = this.capacity;
            }

            if (typeof(this.image) === 'string' || this.image === undefined) {
                this.image = options.image;
            } else {
                this.sprites.animations.sprites.weapon = {
                    image: this.image,
                    width: this.width,
                    height: this.height,
                };

                this.sprites.animations.states.weapon.steps[0]['weapon'][0] = this.x;
                this.sprites.animations.states.weapon.steps[0]['weapon'][1] = this.y;
                this.sprites.animations.states.weapon.steps[0]['weapon'][2] = this.angle;
                this.sprites.addState('weapon');
            }
        },
        
        shot (x, y, angle) {
            if (this.projectilesCount <= 0) {
                this.recharge();
            }
            if (!this.isRecharging) {
                if (this.shotTimer >= this.timeBetweenShots) {
                    this.shotTimer = 0;
                    --this.projectilesCount;
                    Body.applyForce(this.body, this.body.position, {x: -Math.cos(angle) * this.knockback, y: -Math.sin(angle) * this.knockback});

                    const a = Bodies.rectangle(x + 80 * Math.cos(angle), y + 240 * Math.sin(angle), 20, 20, {mass: 0.5, restitution: 0});
                    this.level.addBody(a);

                    Body.applyForce(a, a.position, {x: 0.05 * Math.cos(angle), y: 0.05 * Math.sin(angle)});

                    this.sprites.addState(this.fireAnimation, true);

                    return true;
                }
            }
            return false;
        },

        recharge () {
            if (this.projectilesCount < this.capacity && !this.isRecharging) {
                this.isRecharging = true;
            }
        },

        getZoom () {
            return this.zoom;
        },

        setZoom (zoom) {
            this.zoom = Math.max(Math.min(zoom, this.maxZoom), 1);
        },

        addZoom (zoom) {
            this.zoom += zoom;
            this.zoom = Math.max(Math.min(this.zoom, this.maxZoom), 1);
        }

    }
}