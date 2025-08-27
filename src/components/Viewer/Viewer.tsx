// import * as THREE from "three"
// import * as BUI from "@thatopen/ui"
import * as OBC from "@thatopen/components"
import { useEffect, useRef } from "react"

export const Viewer = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const initializeViewer = async () => {
      const components = new OBC.Components()
      const worlds = components.get(OBC.Worlds)
      const world = worlds.create<
        OBC.SimpleScene,
        OBC.SimpleCamera,
        OBC.SimpleRenderer
      >()
      
      world.scene = new OBC.SimpleScene(components)
      world.renderer = new OBC.SimpleRenderer(components, containerRef.current!)
      world.camera = new OBC.SimpleCamera(components)
      components.init()
      world.scene.setup()
      world.scene.three.background = null

      const githubUrl =
        "/worker/worker.mjs"
      const fetchedUrl = await fetch(githubUrl)
      const workerBlob = await fetchedUrl.blob()
      const workerFile = new File([workerBlob], "worker.mjs", {
        type: "text/javascript",
      })
      const workerUrl = URL.createObjectURL(workerFile)
      const fragments = components.get(OBC.FragmentsManager)
      fragments.init(workerUrl)

      world.camera.controls.addEventListener("rest", () =>
        fragments.core.update(true),
      )

      fragments.list.onItemSet.add(({ value: model }) => {
        model.useCamera(world.camera.three)
        world.scene.three.add(model.object)
        fragments.core.update(true)
      })

      const fragPaths = [
        "/public/Model/frag/school_arq.frag"
      ]
      
      await Promise.all(
        fragPaths.map(async (path) => {
          const modelId = path.split("/").pop()?.split(".").shift()
          if (!modelId) return null
          const file = await fetch(path)
          const buffer = await file.arrayBuffer()
          return fragments.core.load(buffer, { modelId })
        }),
      )

      await world.camera.controls.setLookAt(68, 23, -8.5, 21.5, -5.5, 23)
      await fragments.core.update(true)
    }

    initializeViewer().catch(console.error)

    return () => {

    }
  }, [])

  return <div id="container" ref={containerRef} style={{ width: '100%', height: '100%', position:"absolute", top:"0%", left:"0%"}}></div>
}