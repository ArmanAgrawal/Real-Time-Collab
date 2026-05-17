import { useDispatch, useSelector } from "react-redux"
import { createSlide, reorderedSlide, reorderSlide, setCurrentSlide } from "../../redux/slices/SlideSlice";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

/* ---------- Sortable Item Component ---------- */
function SortableItem({ slide, index, currentSlideIndex, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: String(slide.id) });

const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  padding: 12,
  marginTop: 12,
  borderRadius: 10,
  background:
    currentSlideIndex === index ? "#dbeafe" : "#ffffff",
  border:
    currentSlideIndex === index
      ? "2px solid #3b82f6"
      : "1px solid #e5e7eb",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
};

  return (
    <div ref={setNodeRef} style={style} onClick={onClick} >

      {/* Slide Name */}
      <span>Slide {index + 1}</span>

      {/* Drag Handle */}
      <span
        {...attributes}
        {...listeners}
        style={{
          cursor: "grab",
          padding: "4px",
          fontSize: "14px"
        }}
      >
        ☰
      </span>

    </div>
  );
}


const SlideSidebar = ({ workspaceId, presentationId }) => {
    const dispatch = useDispatch();
    
    const { slides, currentSlideIndex } = useSelector(
        (state) => state.slide
    );
    const addSlide = () => {
        dispatch(createSlide({ workspaceId, presentationId }));
    }

    const handleDragEnd=(event)=>{
        const {active,over}=event;
        if(!over || active.id===over.id) return;

       const oldIndex = slides.findIndex((s)=>String(s.id)===active.id);
        const newIndex = slides.findIndex((s)=>String(s.id)===over.id);

        /* Update UI instantly */
        dispatch(
            reorderedSlide({sourceIndex:oldIndex,destinationIndex:newIndex})
        );

         /* Sync backend */
         dispatch(
            reorderSlide({workspaceId,presentationId,slideId:active.id,newOrder:newIndex})
         )
    }

    return (
        <div
  style={{
    width: 220,
    borderRight: "1px solid #e5e7eb",
    padding: 10,
    height: "100vh",
    overflowY: "auto", // ✅ scroll enabled
    background: "#f9fafb"
  }}
>
            <button onClick={addSlide} >+ Add Slide </button>

            <DndContext 
                collisionDetection={closestCenter} 
                onDragEnd={handleDragEnd} >

                <SortableContext
                    items={slides && slides.map((s)=>String(s.id))}
                    strategy={verticalListSortingStrategy}>

                        {
                            slides && slides.map((slide,index)=>(
                                <SortableItem
                                    key={slide.id}
                                    slide={slide}
                                    index={index}
                                    currentSlideIndex={currentSlideIndex}
                                    onClick={()=>dispatch(setCurrentSlide(index))}
                                />
                                    
                            ))
                        }
                    
                </SortableContext>

            </DndContext>

        </div>
    )
}
export default SlideSidebar;