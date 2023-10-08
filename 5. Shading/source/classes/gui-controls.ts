import GUI from "lil-gui";

interface Controls {
  angleX: number;
  angleY: number;
  angleZ: number;
  dX: number;
  dY: number;
  dZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
}

export class GUIControls {
  private _gui: GUI = new GUI();

  public get gui() {
    return this._gui;
  }

  private _controls: Controls = {
    angleX: 0,
    angleY: 0,
    angleZ: 0,

    dX: 0,
    dY: 0,
    dZ: 0,

    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
  };

  public get controls() {
    return this._controls;
  }

  public setupGUI() {
    this._gui.add(this._controls, "angleX", 0, 2 * Math.PI).name("Rotation X");
    this._gui.add(this._controls, "angleY", 0, 2 * Math.PI).name("Rotation Y");
    this._gui.add(this._controls, "angleZ", 0, 2 * Math.PI).name("Rotation Z");

    this._gui.add(this._controls, "dX", -50, 50).name("Translation X");
    this._gui.add(this._controls, "dY", -50, 50).name("Translation Y");
    this._gui.add(this._controls, "dZ", -50, 50).name("Translation Z");

    this._gui.add(this._controls, "scaleX", 0, 10).name("Scale X");
    this._gui.add(this._controls, "scaleY", 0, 10).name("Scale Y");
    this._gui.add(this._controls, "scaleZ", 0, 10).name("Scale Z");

    this._gui.add(
      {
        reset: () => {
          this._gui.reset();
        },
      },
      "reset"
    );
    this._gui.onChange(() => {});
  }
}
