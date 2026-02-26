import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Navbar from "../components/Navbar";
import TaskItem from "../components/todo/TaskItem";
import Calendar from "../components/todo/Calendar";
import CreateTask from "../components/todo/CreateTask";

const formatTime = (totalMinutes) => {
  if (totalMinutes <= 0) return "0 min";

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  const hDisplay = hours > 0 ? `${hours} hr ` : "";
  const mDisplay = mins > 0 ? `${mins} min` : "";

  return hDisplay + mDisplay;
};

const TodoListPage = () => {
  const [mode, setMode] = useState("normal");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  const token = localStorage.getItem("token") || "";

  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const [summary, setSummary] = useState({
    tasks: { total: 0, completed: 0 },
    time: { total_planned: 0, total_actual_spent: 0 },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        console.log("Fetching data for:", formattedDate);

        const [taskRes, catRes, sumRes] = await Promise.all([
          fetch(`/api/tasks?date=${formattedDate}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`/api/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(
            `/api/tasks/summary?date=${formattedDate}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
        ]);

        if (taskRes.ok) {
          const data = await taskRes.json();
          const fetchedTasks = Array.isArray(data.tasks) ? data.tasks : [];
          setTasks(
            fetchedTasks.sort((a, b) => (a.position || 0) - (b.position || 0)),
          );
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }

        if (sumRes.ok) {
          const sumData = await sumRes.json();
          setSummary(sumData.summary);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [selectedDate, formattedDate, token]);
  const handleOnDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const movedTaskId = parseInt(draggableId);
    let newTasks = [...tasks];
    let tasksToUpdateDB = [];

    if (mode === "normal") {
      const items = tasks
        .filter((t) => t.is_completed === 0 || !t.is_completed)
        .sort((a, b) => (a.position || 0) - (b.position || 0));

      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      const updatedActiveItems = items.map((item, index) => ({
        ...item,
        position: index,
      }));

      tasksToUpdateDB = updatedActiveItems;
      newTasks = [
        ...updatedActiveItems,
        ...tasks.filter((t) => t.is_completed === 1),
      ];
    } else {
      const destGroup = destination.droppableId;

      newTasks = newTasks.map((t) =>
        t.task_id === movedTaskId
          ? { ...t, method_333: destGroup, task_type: "METHOD_333" }
          : t,
      );

      const activeOnes = newTasks.filter((t) => t.is_completed === 0);
      const groups = ["IMPORTANT", "SECONDARY", "MINOR"];

      groups.forEach((group) => {
        const groupItems = activeOnes
          .filter((t) => t.method_333 === group)
          .sort((a, b) => (a.position || 0) - (b.position || 0));

        if (group === destGroup) {
          const others = groupItems.filter((t) => t.task_id !== movedTaskId);
          others.splice(
            destination.index,
            0,
            newTasks.find((t) => t.task_id === movedTaskId),
          );
          others.forEach((t, idx) => {
            t.position = idx;
          });
          tasksToUpdateDB.push(...others);
        } else {
          groupItems.forEach((t, idx) => {
            t.position = idx;
          });
          tasksToUpdateDB.push(...groupItems);
        }
      });
    }

    setTasks([...newTasks]);

    try {
      const movedTask = newTasks.find((t) => t.task_id === movedTaskId);

      await fetch(`/api/tasks/${movedTaskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          method_333: movedTask.method_333,
          task_type: mode === "3-3-3" ? "METHOD_333" : "NORMAL",
          position: movedTask.position,
        }),
      });

      await fetch("/api/tasks/reorder", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tasks: tasksToUpdateDB.map((t) => ({
            task_id: t.task_id,
            position: t.position,
          })),
        }),
      });
    } catch (error) {
      console.error("Failed to save order:", error);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      let finalCategoryId = null;
      let finalCatName = taskData.categoryName?.trim() || "Work";
      let finalColor = "#3f8efc";

      const allowColors = [
        "#ff7900",
        "#38b000",
        "#3f8efc",
        "#c77dff",
        "#ffd60a",
        "#87bfff",
        "#fb4b4e",
      ];

      const existingCat = categories.find(
        (c) => c.name.toLowerCase() === finalCatName.toLowerCase(),
      );

      if (existingCat) {
        finalCategoryId = existingCat.category_id;
        finalColor = existingCat.color_code;
        finalCatName = existingCat.name;
      } else {
        const usedColors = categories.map((c) => c.color_code);
        const availableColors = allowColors.filter(
          (color) => !usedColors.includes(color),
        );
        const pool = availableColors.length > 0 ? availableColors : allowColors;
        finalColor = pool[Math.floor(Math.random() * pool.length)];

        const catRes = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: finalCatName, color_code: finalColor }),
        });

        if (catRes.ok) {
          const newCatData = await catRes.json();
          finalCategoryId = newCatData.categoryId;
          setCategories((prev) => [
            ...prev,
            {
              category_id: finalCategoryId,
              name: finalCatName,
              color_code: finalColor,
            },
          ]);
        }
      }

      if (!finalCategoryId) return;

      const activeTasksNow = tasks.filter((t) => t.is_completed === 0);
      const importantCount = activeTasksNow.filter(
        (t) => t.method_333 === "IMPORTANT",
      ).length;
      const secondaryCount = activeTasksNow.filter(
        (t) => t.method_333 === "SECONDARY",
      ).length;

      let autoMethod = "MINOR";
      if (importantCount < 3) autoMethod = "IMPORTANT";
      else if (secondaryCount < 3) autoMethod = "SECONDARY";

      const minPosition = tasks.length > 0 
      ? Math.min(...tasks.map(t => t.position || 0)) 
      : 0;
      const newPosition = minPosition - 1;

      const dataToSend = {
        title: taskData.title,
        category_id: finalCategoryId,
        is_completed: 0,
        focus_time_spent: parseInt(taskData.time) || 0,
        task_type: mode === "3-3-3" ? "METHOD_333" : "NORMAL",
        method_333: autoMethod,
        date: formattedDate,
        position: newPosition
      };

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        const newTask = {
          ...dataToSend,
          task_id: result.taskId,
          category_name: finalCatName,
          category_color: finalColor,
        };
        setTasks((prev) => 
        [newTask, ...prev].sort((a, b) => (a.position || 0) - (b.position || 0))
        );
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTask = async (id) => {
    const taskToUpdate = tasks.find((t) => t.task_id === id);
    if (!taskToUpdate) return;
    try {
      const newStatus = taskToUpdate.is_completed === 1 ? 0 : 1;
      const response = await fetch(
        `/api/tasks/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_completed: newStatus }),
        },
      );
      if (response.ok) {
        setTasks(
          tasks.map((task) =>
            task.task_id === id ? { ...task, is_completed: newStatus } : task,
          ),
        );

        const sumRes = await fetch(
          `/api/tasks/summary?date=${formattedDate}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (sumRes.ok) {
          const sumData = await sumRes.json();
          setSummary(sumData.summary);
        }
      }
      
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const activeTasks = tasks
    .filter((t) => t.is_completed === 0 || !t.is_completed)
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  const completedTasks = tasks.filter((t) => t.is_completed === 1 || t.is_completed === 2);

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-10">
      <Navbar showCoins={true} showSignIn={false} />
      <main className="max-w-[1400px] mx-auto px-12 mt-10 grid grid-cols-12 gap-8">
        <div className="col-span-3 space-y-4">
          <div className="flex bg-[#E5E7EB] p-1 rounded-full mb-6 w-fit">
            <button
              onClick={() => setMode("normal")}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === "normal" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"}`}
            >
              Normal
            </button>
            <button
              onClick={() => setMode("3-3-3")}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === "3-3-3" ? "bg-white text-[#6366F1] shadow-sm" : "text-slate-400"}`}
            >
              3-3-3
            </button>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 w-fit min-w-[260px]">
            <p className="text-xs font-bold text-slate-800 mb-4">
              {summary.tasks.completed} of {summary.tasks.total} completed
            </p>
            {/* Total Time: เวลาที่วางแผนไว้ทั้งหมด */}
            <div className="space-y-3">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400">Total Time:</span>
                <span className="text-slate-800">
                  {formatTime(summary.time.total_planned)}
                </span>
              </div>
            </div>
            {/* Time Remaining: เวลาที่เหลือ (Planned - Actual) */}
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-slate-400 tracking-wider">
                Time Remaining:
              </span>
              <span className="text-indigo-600">
                {formatTime(summary.time.time_remaining)}
              </span>
            </div>
            {/* Progress Bar (แถมให้เพื่อความสวยงาม) */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-full transition-all duration-500"
                style={{
                  width: `${
                    summary.time.total_planned > 0
                      ? ((summary.time.total_planned -
                          summary.time.time_remaining) /
                          summary.time.total_planned) *
                        100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="col-span-6 space-y-8">
          <CreateTask onAddTask={handleAddTask} categories={categories} />
          <DragDropContext onDragEnd={handleOnDragEnd}>
            {mode === "normal" ? (
              <section>
                <h2 className="text-xl font-black text-slate-800 mb-4">
                  Tasks
                </h2>
                <Droppable droppableId="tasks-normal">
                  {(provided) => (
                    <div
                      className="space-y-3"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {activeTasks.map((task, index) => (
                        <Draggable
                          key={task.task_id.toString()}
                          draggableId={task.task_id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskItem
                                task={task}
                                onToggle={() => toggleTask(task.task_id)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </section>
            ) : (
              <div className="space-y-10">
                {[
                  { key: "IMPORTANT", label: "Main" },
                  { key: "SECONDARY", label: "Secondary" },
                  { key: "MINOR", label: "Minor" },
                ].map((prio) => (
                  <section key={prio.key}>
                    <h2
                      className={`text-xl font-black mb-4 flex items-center gap-2 ${prio.key === "IMPORTANT" ? "text-indigo-600" : "text-slate-600"}`}
                    >
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${prio.key === "IMPORTANT" ? "bg-indigo-100" : "bg-slate-200"}`}
                      >
                        3
                      </span>
                      {prio.label} Tasks
                    </h2>
                    <Droppable droppableId={prio.key}>
                      {(provided) => (
                        <div
                          className="space-y-3 min-h-[50px]"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {activeTasks
                            .filter((t) => t.method_333 === prio.key)
                            .map((task, index) => (
                              <Draggable
                                key={task.task_id.toString()}
                                draggableId={task.task_id.toString()}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <TaskItem
                                      task={task}
                                      onToggle={() => toggleTask(task.task_id)}
                                      highlight={prio.key === "IMPORTANT"}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </section>
                ))}
              </div>
            )}
          </DragDropContext>

          <hr className="border-slate-300 my-8" />
          <section>
            <h2 className="text-xl font-black text-slate-800 mb-4">
              Completed
            </h2>
            <div className="space-y-3 opacity-60">
              {completedTasks.map((task) => (
                <TaskItem
                  key={`done-${task.task_id}`}
                  task={task}
                  onToggle={() => toggleTask(task.task_id)}
                  isCompletedView={true}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-3">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>
      </main>
    </div>
  );
};

export default TodoListPage;