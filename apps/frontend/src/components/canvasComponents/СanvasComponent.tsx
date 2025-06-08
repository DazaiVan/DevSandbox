import Scene from "./canvas/Scene";
import useCounterStore from "../../store/store";
import TestTS from "../TestTS";

function CanvasComponent() {
  const {count} = useCounterStore();
  return (
    <div className="app-container">
      <div className="canvas-container">
        <Scene />
        {true && (
          <div className="right-panel">
            <h2>Панель управления</h2>
            <div className="panel-content">
              <p>Настройки сцены</p>
              <button>Действие 1</button>
              <button>Действие 2</button>
            </div>
          </div>
        )}
      </div>
      <TestTS />
    </div>

  );
}

export default CanvasComponent;