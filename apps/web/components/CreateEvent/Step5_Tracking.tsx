// "use client";

// import {
//   useEffect,
//   useState,
// } from "react";

// import {
//   useGetEventStatusQuery,
// } from "@/store/apiSlice";

// import {
//   useCreateEvent,
// } from "@/hooks/useCreateEvent";

// export default function Step5_Tracking() {
//   const {
//     eventId,
//     sending,
//     selectedGuests,
//     goNext,
//     updateSendingStatus,
//     sendingCompleted,
//   } = useCreateEvent();

//   const [
//     isComplete,
//     setIsComplete,
//   ] = useState(false);

//   const [
//     elapsedTime,
//     setElapsedTime,
//   ] = useState(0);

//   // =====================================================
//   // POLLING
//   // =====================================================

//   const {
//     data: eventStatus,
//     isLoading,
//   } =
//     useGetEventStatusQuery(
//       eventId || "",
//       {
//         skip:
//           !eventId,

//         pollingInterval:
//           5000,

//         refetchOnFocus:
//           true,

//         refetchOnReconnect:
//           true,
//       }
//     );

//   // =====================================================
//   // UPDATE STATUS
//   // =====================================================

//   useEffect(() => {
//     if (!eventStatus)
//       return;

//     const summary =
//       eventStatus?.data
//         ?.summary;

//     updateSendingStatus({
//       sentCount:
//         summary?.sent ||
//         0,

//       deliveredCount:
//         summary?.delivered ||
//         0,

//       readCount:
//         summary?.read ||
//         0,

//       failedCount:
//         summary?.failed ||
//         0,

//       pendingCount:
//         summary?.pending ||
//         0,
//     });

//     const total =
//       (summary?.sent ||
//         0) +
//       (summary?.delivered ||
//         0) +
//       (summary?.read ||
//         0) +
//       (summary?.failed ||
//         0);

//     if (
//       total >=
//       selectedGuests.length
//     ) {
//       setIsComplete(
//         true
//       );

//       sendingCompleted();
//     }
//   }, [
//     eventStatus,
//     selectedGuests.length,
//     updateSendingStatus,
//     sendingCompleted,
//   ]);

//   // =====================================================
//   // ELAPSED TIME
//   // =====================================================

//   useEffect(() => {
//     const interval =
//       setInterval(() => {
//         setElapsedTime(
//           (prev) =>
//             prev + 1
//         );
//       }, 1000);

//     return () =>
//       clearInterval(
//         interval
//       );
//   }, []);

//   // =====================================================
//   // PROGRESS
//   // =====================================================

//   const totalProcessed =
//     sending.sentCount +
//     sending.deliveredCount +
//     sending.readCount +
//     sending.failedCount;

//   const percentage =
//     selectedGuests.length >
//     0
//       ? Math.round(
//           (totalProcessed /
//             selectedGuests.length) *
//             100
//         )
//       : 0;

//   // =====================================================
//   // FORMAT TIME
//   // =====================================================

//   const formatTime = (
//     seconds: number
//   ) => {
//     const mins =
//       Math.floor(
//         seconds / 60
//       );

//     const secs =
//       seconds % 60;

//     return `${mins}m ${secs}s`;
//   };

//   // =====================================================
//   // STATUS TEXT
//   // =====================================================

//   const getStatusText =
//     () => {
//       if (
//         isComplete
//       ) {
//         return "✓ Complete! All messages processed";
//       }

//       return "📤 Sending invites...";
//     };

//   return (
//     <div className="w-full max-w-4xl mx-auto">
//       {/* HEADER */}

//       <div className="mb-8 text-center">
//         <h2 className="text-3xl font-bold text-gray-900 mb-2">
//           Step 5 of 5:
//           Tracking
//         </h2>

//         <p className="text-gray-600">
//           {isComplete
//             ? "All invites have been sent! 🎉"
//             : "Sending WhatsApp invites to your guests..."}
//         </p>
//       </div>

//       {/* MAIN CARD */}

//       <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 mb-8 relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-transparent to-indigo-50 opacity-50"></div>

//         <div className="relative z-10">
//           {/* STATUS */}

//           <div className="text-center mb-8">
//             <div className="inline-block mb-4">
//               {isComplete ? (
//                 <div className="text-6xl animate-bounce">
//                   🎉
//                 </div>
//               ) : (
//                 <div className="text-6xl animate-spin">
//                   📤
//                 </div>
//               )}
//             </div>

//             <p className="text-xl font-semibold text-gray-900">
//               {getStatusText()}
//             </p>

//             <p className="text-sm text-gray-600 mt-2">
//               {isComplete
//                 ? "Your invites are on their way!"
//                 : `Elapsed: ${formatTime(
//                     elapsedTime
//                   )}`}
//             </p>
//           </div>

//           {/* PROGRESS BAR */}

//           <div className="mb-8">
//             <div className="flex justify-between items-center mb-2">
//               <span className="text-sm font-semibold text-gray-700">
//                 Overall Progress
//               </span>

//               <span className="text-sm font-bold text-blue-600">
//                 {percentage}%
//               </span>
//             </div>

//             <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
//               <div
//                 className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
//                 style={{
//                   width: `${percentage}%`,
//                 }}
//               />
//             </div>
//           </div>

//           {/* STATS */}

//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//             {[
//               {
//                 label:
//                   "Sent",
//                 value:
//                   sending.sentCount,
//                 emoji:
//                   "📤",
//                 color:
//                   "text-blue-600",
//               },

//               {
//                 label:
//                   "Delivered",
//                 value:
//                   sending.deliveredCount,
//                 emoji:
//                   "✓",
//                 color:
//                   "text-green-600",
//               },

//               {
//                 label:
//                   "Read",
//                 value:
//                   sending.readCount,
//                 emoji:
//                   "👁️",
//                 color:
//                   "text-purple-600",
//               },

//               {
//                 label:
//                   "Failed",
//                 value:
//                   sending.failedCount,
//                 emoji:
//                   "❌",
//                 color:
//                   "text-red-600",
//               },

//               {
//                 label:
//                   "Pending",
//                 value:
//                   sending.pendingCount,
//                 emoji:
//                   "⏳",
//                 color:
//                   "text-gray-600",
//               },
//             ].map(
//               (
//                 item
//               ) => (
//                 <div
//                   key={
//                     item.label
//                   }
//                   className="bg-white rounded-lg p-4 border border-gray-200 text-center"
//                 >
//                   <p
//                     className={`text-3xl font-bold ${item.color}`}
//                   >
//                     {
//                       item.value
//                     }
//                   </p>

//                   <p className="text-xs text-gray-600 font-medium mt-1">
//                     {
//                       item.label
//                     }
//                   </p>

//                   <p className="text-xs text-gray-500 mt-1">
//                     {
//                       item.emoji
//                     }
//                   </p>
//                 </div>
//               )
//             )}
//           </div>
//         </div>
//       </div>

//       {/* LIVE STATUS */}

//       <div className="text-center mb-8">
//         {isLoading &&
//           !isComplete && (
//             <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
//               🔄 Updating
//               live...
//             </div>
//           )}

//         {isComplete && (
//           <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
//             ✓ All updates
//             complete
//           </div>
//         )}
//       </div>

//       {/* NAVIGATION */}

//       <div className="flex gap-4 justify-center mb-6">
//         {isComplete ? (
//           <>
//             <button
//               onClick={() =>
//                 (window.location.href =
//                   "/events")
//               }
//               className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold"
//             >
//               ← View Events
//             </button>

//             <button
//               onClick={
//                 goNext
//               }
//               className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold"
//             >
//               Create Another
//               Event →
//             </button>
//           </>
//         ) : (
//           <div className="text-center text-gray-600">
//             <p className="text-sm">
//               Please wait while
//               messages are
//               being sent...
//             </p>

//             <p className="text-xs text-gray-500 mt-2">
//               Do not close
//               this page
//             </p>
//           </div>
//         )}
//       </div>

//       {/* FOOTER */}

//       <div className="text-center text-xs text-gray-500 pb-4">
//         <p>
//           💡 Updates every
//           5 seconds.
//           Event ID:{" "}
//           {eventId?.substring(
//             0,
//             8
//           )}
//           ...
//         </p>
//       </div>
//     </div>
//   );
// }


"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useGetEventStatusQuery,
} from "@/store/apiSlice";

import {
  useCreateEvent,
} from "@/hooks/useCreateEvent";

export default function Step5_Tracking() {
  const {
    eventId,
    selectedGuests,
  } = useCreateEvent();

  const [
    sendingStatus,
    setSendingStatus,
  ] = useState({
    sentCount: 0,
    deliveredCount: 0,
    readCount: 0,
    failedCount: 0,
    pendingCount: 0,
  });

  const [
    isComplete,
    setIsComplete,
  ] = useState(false);

  // =====================================================
  // POLLING - Background only, no blocking
  // =====================================================

  const {
    data: eventStatus,
    isLoading,
  } =
    useGetEventStatusQuery(
      eventId || "",
      {
        skip:
          !eventId,

        pollingInterval:
          5000,

        refetchOnFocus:
          true,

        refetchOnReconnect:
          true,
      }
    );

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  useEffect(() => {
    if (!eventStatus)
      return;

    const summary =
      eventStatus?.data
        ?.summary;

    setSendingStatus({
      sentCount:
        summary?.sent ||
        0,

      deliveredCount:
        summary?.delivered ||
        0,

      readCount:
        summary?.read ||
        0,

      failedCount:
        summary?.failed ||
        0,

      pendingCount:
        summary?.pending ||
        0,
    });

    const total =
      (summary?.sent ||
        0) +
      (summary?.delivered ||
        0) +
      (summary?.read ||
        0) +
      (summary?.failed ||
        0);

    if (
      total >=
      selectedGuests.length
    ) {
      setIsComplete(
        true
      );
    }
  }, [
    eventStatus,
    selectedGuests.length,
  ]);

  // =====================================================
  // PROGRESS
  // =====================================================

  const totalProcessed =
    sendingStatus.sentCount +
    sendingStatus.deliveredCount +
    sendingStatus.readCount +
    sendingStatus.failedCount;

  const percentage =
    selectedGuests.length >
    0
      ? Math.round(
          (totalProcessed /
            selectedGuests.length) *
            100
        )
      : 0;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 16px" }}>
      {/* HEADER */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
          Step 5 of 5: Tracking
        </h2>
        <p style={{ color: "#999", fontSize: "14px" }}>
          {isComplete
            ? "✓ All invites sent! Check status anytime"
            : "Sending WhatsApp invites in background..."}
        </p>
      </div>

      {/* MAIN CARD */}
      <div style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "12px",
        padding: "32px",
        marginBottom: "32px",
      }}>
        {/* STATUS ICON */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            fontSize: "64px",
            marginBottom: "16px",
            animation: isComplete ? "none" : "spin 2s linear infinite",
          }}>
            {isComplete ? "🎉" : "📤"}
          </div>

          <p style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "8px",
          }}>
            {isComplete
              ? "✓ Complete!"
              : "Sending Invites..."}
          </p>

          <p style={{
            fontSize: "14px",
            color: "#999",
          }}>
            {isComplete
              ? "All messages sent successfully"
              : "Messages are being sent in the background"}
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}>
            <span style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#999",
            }}>
              Overall Progress
            </span>

            <span style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#60a5fa",
            }}>
              {percentage}%
            </span>
          </div>

          <div style={{
            width: "100%",
            height: "8px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "4px",
            overflow: "hidden",
          }}>
            <div
              style={{
                width: `${percentage}%`,
                height: "100%",
                background: "linear-gradient(90deg, #60a5fa, #3b82f6)",
                borderRadius: "4px",
                transition: "width 0.5s ease-out",
              }}
            />
          </div>
        </div>

        {/* STATS GRID */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "12px",
        }}>
          {[
            { label: "Sent", value: sendingStatus.sentCount, emoji: "📤", color: "#60a5fa" },
            { label: "Delivered", value: sendingStatus.deliveredCount, emoji: "✓", color: "#4ade80" },
            { label: "Read", value: sendingStatus.readCount, emoji: "👁️", color: "#a78bfa" },
            { label: "Failed", value: sendingStatus.failedCount, emoji: "❌", color: "#ef4444" },
            { label: "Pending", value: sendingStatus.pendingCount, emoji: "⏳", color: "#6b7280" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "16px",
                textAlign: "center",
              }}
            >
              <p style={{
                fontSize: "24px",
                fontWeight: 700,
                color: item.color,
              }}>
                {item.value}
              </p>

              <p style={{
                fontSize: "12px",
                color: "#999",
                marginTop: "4px",
              }}>
                {item.label}
              </p>

              <p style={{
                fontSize: "16px",
                marginTop: "4px",
              }}>
                {item.emoji}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* STATUS BADGE */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        {isLoading && !isComplete && (
          <div style={{
            display: "inline-block",
            padding: "8px 16px",
            background: "rgba(59, 130, 246, 0.2)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            color: "#60a5fa",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 600,
          }}>
            🔄 Live updating...
          </div>
        )}

        {isComplete && (
          <div style={{
            display: "inline-block",
            padding: "8px 16px",
            background: "rgba(74, 222, 128, 0.2)",
            border: "1px solid rgba(74, 222, 128, 0.3)",
            color: "#4ade80",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 600,
          }}>
            ✓ Complete
          </div>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div style={{
        display: "flex",
        gap: "12px",
        justifyContent: "center",
        marginBottom: "32px",
      }}>
        <button
          onClick={() => window.location.href = "/events"}
          style={{
            padding: "12px 32px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
          }}
        >
          ← Go to Events
        </button>

        <button
          onClick={() => window.location.href = "/dashboard"}
          style={{
            padding: "12px 32px",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(135deg, #e91e8c, #ff5252)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 35px rgba(233, 30, 140, 0.5)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 25px rgba(233, 30, 140, 0.3)";
          }}
        >
          Go to Dashboard →
        </button>
      </div>

      {/* INFO */}
      <div style={{
        background: "rgba(59, 130, 246, 0.1)",
        border: "1px solid rgba(59, 130, 246, 0.2)",
        borderRadius: "8px",
        padding: "16px",
        textAlign: "center",
      }}>
        <p style={{
          fontSize: "12px",
          color: "#60a5fa",
          marginBottom: "4px",
        }}>
          💡 Messages send in the background
        </p>

        <p style={{
          fontSize: "12px",
          color: "#999",
        }}>
          Status updates every 5 seconds. You can close this page and check back anytime. Event ID: {eventId?.substring(0, 8)}...
        </p>
      </div>

      {/* CSS ANIMATION */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}