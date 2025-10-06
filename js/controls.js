/**
 * PointerLockControls implementation
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 */
const PointerLockControls = function ( camera, domElement ) {
    if ( domElement === undefined ) {
        console.warn( 'THREE.PointerLockControls: The second parameter "domElement" is now mandatory.' );
        domElement = document.body;
    }

    const scope = this;
    const euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
    const PI_2 = Math.PI / 2;
    scope.isLocked = false;

    const connect = function () {
        domElement.ownerDocument.addEventListener( 'mousemove', onMouseMove, false );
        domElement.ownerDocument.addEventListener( 'pointerlockchange', onPointerlockChange, false );
        domElement.ownerDocument.addEventListener( 'pointerlockerror', onPointerlockError, false );
    };

    const disconnect = function () {
        domElement.ownerDocument.removeEventListener( 'mousemove', onMouseMove, false );
        domElement.ownerDocument.removeEventListener( 'pointerlockchange', onPointerlockChange, false );
        domElement.ownerDocument.removeEventListener( 'pointerlockerror', onPointerlockError, false );
    };

    const dispose = function () {
        disconnect();
    };

    const onMouseMove = function ( event ) {
        if ( scope.isLocked === false ) return;

        const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        euler.setFromQuaternion( camera.quaternion );

        euler.y -= movementX * 0.002;
        euler.x -= movementY * 0.002;

        euler.x = Math.max( - PI_2, Math.min( PI_2, euler.x ) );

        camera.quaternion.setFromEuler( euler );

        scope.dispatchEvent( { type: 'change' } );
    };

    const onPointerlockChange = function () {
        if ( domElement.ownerDocument.pointerLockElement === domElement ) {
            scope.dispatchEvent( { type: 'lock' } );
            scope.isLocked = true;
        } else {
            scope.dispatchEvent( { type: 'unlock' } );
            scope.isLocked = false;
        }
    };

    const onPointerlockError = function () {
        console.error( 'THREE.PointerLockControls: Unable to use Pointer Lock API' );
    };

    // Public API
    this.domElement = domElement;

    this.lock = function () {
        this.domElement.requestPointerLock();
    };

    this.unlock = function () {
        this.domElement.ownerDocument.exitPointerLock();
    };

    this.getObject = function () {
        return camera;
    };

    const vector = new THREE.Vector3();

    this.getDirection = function () {
        return function ( v ) {
            v.set( 0, 0, - 1 ).applyQuaternion( camera.quaternion );
            return v;
        };
    }();

    this.moveForward = function ( distance ) {
        vector.setFromMatrixColumn( camera.matrix, 0 );
        vector.crossVectors( camera.up, vector );
        camera.position.addScaledVector( vector, distance );
    };

    this.moveRight = function ( distance ) {
        vector.setFromMatrixColumn( camera.matrix, 0 );
        camera.position.addScaledVector( vector, distance );
    };

    this.connect = connect;
    this.disconnect = disconnect;
    this.connect(); // Automatically connect
};

PointerLockControls.prototype = Object.create( THREE.EventDispatcher.prototype );
PointerLockControls.prototype.constructor = PointerLockControls;