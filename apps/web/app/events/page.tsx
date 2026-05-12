// "use client";

// import {
//   useSearchParams,
// } from "next/navigation";

// import {
//   useEffect,
//   useState,
// } from "react";

// import CreateEventModal
// from "@/components/CreateEvent/CreateEventModal";

// import EventDetailsModal
// from "./EventDetailsModal";

// import {
//   useGetEventsQuery,
// } from "@/store/apiSlice";

// import styles
// from "./Events.module.css";

// export default function EventsPage() {
//   // =====================================================
//   // STATE
//   // =====================================================

//   const params =
//     useSearchParams();

//   const templateId =
//     params.get(
//       "templateId"
//     );

//   const [open, setOpen] =
//     useState(false);

//   const [
//     selectedEvent,
//     setSelectedEvent,
//   ] = useState<any>(
//     null
//   );

//   // =====================================================
//   // API
//   // =====================================================

//   const {
//     data,
//     isLoading,
//   } =
//     useGetEventsQuery();

//   const events =
//     data?.data || [];

//   // =====================================================
//   // EFFECTS
//   // =====================================================

//   useEffect(() => {
//     if (templateId) {
//       setOpen(true);
//     }
//   }, [templateId]);

//   // =====================================================
//   // HELPERS
//   // =====================================================

//   const getEventStatus =
//     (event: any) => {
//       const pending =
//         event.pendingCount ||
//         0;

//       if (pending > 0) {
//         return {
//           label:
//             "In Progress",

//           color:
//             "#f59e0b",

//           bg:
//             "rgba(245,158,11,0.1)",

//           border:
//             "rgba(245,158,11,0.25)",
//         };
//       }

//       if (
//         event.failedCount >
//         0
//       ) {
//         return {
//           label:
//             "Has Failures",

//           color:
//             "#f87171",

//           bg:
//             "rgba(248,113,113,0.1)",

//           border:
//             "rgba(248,113,113,0.25)",
//         };
//       }

//       return {
//         label:
//           "Completed",

//         color:
//           "#34d399",

//         bg:
//           "rgba(52,211,153,0.1)",

//         border:
//           "rgba(52,211,153,0.25)",
//       };
//     };

//   const getEventTypeIcon =
//     (
//       category: string
//     ) => {
//       const lower =
//         category?.toLowerCase() ||
//         "";

//       if (
//         lower.includes(
//           "wedding"
//         )
//       )
//         return "💍";

//       if (
//         lower.includes(
//           "birthday"
//         )
//       )
//         return "🎂";

//       if (
//         lower.includes(
//           "business"
//         )
//       )
//         return "🏢";

//       return "🎉";
//     };

//   const getSentPercentage =
//     (event: any) => {
//       return event.totalGuests >
//         0
//         ? Math.round(
//             (event.sentCount /
//               event.totalGuests) *
//               100
//           )
//         : 0;
//     };

//   // =====================================================
//   // STATS
//   // =====================================================

//   const statistics = [
//     {
//       label:
//         "Total Events",

//       value:
//         events.length,

//       isPink: false,
//     },

//     {
//       label:
//         "Total Guests",

//       value:
//         events.reduce(
//           (
//             acc: number,
//             event: any
//           ) =>
//             acc +
//             (event.totalGuests ||
//               0),
//           0
//         ),

//       isPink: false,
//     },

//     {
//       label:
//         "Invites Sent",

//       value:
//         events.reduce(
//           (
//             acc: number,
//             event: any
//           ) =>
//             acc +
//             (event.sentCount ||
//               0),
//           0
//         ),

//       isPink: true,
//     },

//     {
//       label:
//         "Failed",

//       value:
//         events.reduce(
//           (
//             acc: number,
//             event: any
//           ) =>
//             acc +
//             (event.failedCount ||
//               0),
//           0
//         ),

//       isPink: false,
//     },
//   ];

//   // =====================================================
//   // RENDER
//   // =====================================================

//   return (
//     <>
//       {/* BLOBS */}

//       <div
//         className={
//           styles.blob
//         }
//         style={{
//           width: 500,
//           height: 500,
//           left: "-10%",
//           top: "-10%",
//           background:
//             "#e91e8c",
//         }}
//       />

//       <div
//         className={
//           styles.blob
//         }
//         style={{
//           width: 350,
//           height: 350,
//           right: "-8%",
//           bottom: "10%",
//           background:
//             "#ff5252",
//           animationDelay:
//             "6s",
//         }}
//       />

//       {/* PAGE */}

//       <div
//         className={
//           styles.page
//         }
//       >
//         <div
//           className={
//             styles.inner
//           }
//         >
//           {/* TOPBAR */}

//           <div
//             className={
//               styles.topbar
//             }
//           >
//             <div>
//               <h1
//                 className={
//                   styles.title
//                 }
//               >
//                 Your{" "}
//                 <span
//                   className={
//                     styles.titleHighlight
//                   }
//                 >
//                   Events
//                 </span>
//               </h1>

//               <p
//                 className={
//                   styles.subtitle
//                 }
//               >
//                 Manage and
//                 track all
//                 your invite
//                 campaigns
//               </p>
//             </div>

//             <button
//               className={
//                 styles.newBtn
//               }
//               onClick={() =>
//                 setOpen(
//                   true
//                 )
//               }
//             >
//               <span
//                 className={
//                   styles.newBtnIcon
//                 }
//               >
//                 +
//               </span>

//               New Event
//             </button>
//           </div>

//           {/* STATS */}

//           {!isLoading && (
//             <div
//               className={
//                 styles.stats
//               }
//             >
//               {statistics.map(
//                 (
//                   stat
//                 ) => (
//                   <div
//                     key={
//                       stat.label
//                     }
//                     className={
//                       styles.stat
//                     }
//                   >
//                     <div
//                       className={
//                         styles.statLabel
//                       }
//                     >
//                       {
//                         stat.label
//                       }
//                     </div>

//                     <div
//                       className={`${styles.statValue} ${
//                         stat.isPink
//                           ? styles.statValuePink
//                           : ""
//                       }`}
//                     >
//                       {
//                         stat.value
//                       }
//                     </div>
//                   </div>
//                 )
//               )}
//             </div>
//           )}

//           {/* LOADING */}

//           {isLoading && (
//             <div
//               className={
//                 styles.loading
//               }
//             >
//               <div
//                 className={
//                   styles.spinner
//                 }
//               />

//               Loading
//               events...
//             </div>
//           )}

//           {/* EMPTY */}

//           {!isLoading &&
//             events.length ===
//               0 && (
//               <div
//                 className={
//                   styles.empty
//                 }
//               >
//                 <div
//                   className={
//                     styles.emptyIcon
//                   }
//                 >
//                   📭
//                 </div>

//                 <h2
//                   className={
//                     styles.emptyTitle
//                   }
//                 >
//                   No events
//                   yet
//                 </h2>

//                 <p
//                   className={
//                     styles.emptyText
//                   }
//                 >
//                   Create your
//                   first invite
//                   campaign.
//                 </p>

//                 <button
//                   className={
//                     styles.emptyBtn
//                   }
//                   onClick={() =>
//                     setOpen(
//                       true
//                     )
//                   }
//                 >
//                   🚀 Create
//                   First Event
//                 </button>
//               </div>
//             )}

//           {/* GRID */}

//           {!isLoading &&
//             events.length >
//               0 && (
//               <div
//                 className={
//                   styles.grid
//                 }
//               >
//                 {events.map(
//                   (
//                     event: any,
//                     index: number
//                   ) => {
//                     const status =
//                       getEventStatus(
//                         event
//                       );

//                     const sentPct =
//                       getSentPercentage(
//                         event
//                       );

//                     return (
//                       <div
//                         key={
//                           event.id
//                         }
//                         className={
//                           styles.card
//                         }
//                         style={{
//                           animationDelay: `${index * 60}ms`,
//                         }}
//                       >
//                         {/* HEADER */}

//                         <div
//                           className={
//                             styles.cardTop
//                           }
//                         >
//                           <div
//                             className={
//                               styles.cardIcon
//                             }
//                           >
//                             {getEventTypeIcon(
//                               event
//                                 ?.template
//                                 ?.category
//                             )}
//                           </div>

//                           <span
//                             className={
//                               styles.statusBadge
//                             }
//                             style={{
//                               color:
//                                 status.color,

//                               background:
//                                 status.bg,

//                               borderColor:
//                                 status.border,
//                             }}
//                           >
//                             {
//                               status.label
//                             }
//                           </span>
//                         </div>

//                         {/* CONTENT */}

//                         <div
//                           className={
//                             styles.cardType
//                           }
//                         >
//                           {
//                             event
//                               ?.template
//                               ?.category
//                           }
//                         </div>

//                         <div
//                           className={
//                             styles.cardTemplate
//                           }
//                         >
//                           {
//                             event
//                               ?.template
//                               ?.title
//                           }
//                         </div>

//                         {/* PROGRESS */}

//                         <div
//                           className={
//                             styles.progressLabel
//                           }
//                         >
//                           <span>
//                             Delivery
//                             progress
//                           </span>

//                           <span>
//                             {
//                               sentPct
//                             }
//                             %
//                           </span>
//                         </div>

//                         <div
//                           className={
//                             styles.progressTrack
//                           }
//                         >
//                           <div
//                             className={
//                               styles.progressFill
//                             }
//                             style={{
//                               width: `${sentPct}%`,
//                             }}
//                           />
//                         </div>

//                         {/* PILLS */}

//                         <div
//                           className={
//                             styles.pills
//                           }
//                         >
//                           <span
//                             className={`${styles.pill} ${styles.pillSent}`}
//                           >
//                             ✓{" "}
//                             {
//                               event.sentCount
//                             }{" "}
//                             sent
//                           </span>

//                           {event.failedCount >
//                             0 && (
//                             <span
//                               className={`${styles.pill} ${styles.pillFailed}`}
//                             >
//                               ✕{" "}
//                               {
//                                 event.failedCount
//                               }{" "}
//                               failed
//                             </span>
//                           )}

//                           {event.pendingCount >
//                             0 && (
//                             <span
//                               className={`${styles.pill} ${styles.pillPending}`}
//                             >
//                               ⏳{" "}
//                               {
//                                 event.pendingCount
//                               }{" "}
//                               pending
//                             </span>
//                           )}

//                           <span
//                             className={`${styles.pill} ${styles.pillDefault}`}
//                           >
//                             👥{" "}
//                             {
//                               event.totalGuests
//                             }{" "}
//                             total
//                           </span>
//                         </div>

//                         {/* BUTTON */}

//                         <button
//                           className={
//                             styles.cardBtn
//                           }
//                           onClick={() =>
//                             setSelectedEvent(
//                               event
//                             )
//                           }
//                         >
//                           View
//                           Details →
//                         </button>
//                       </div>
//                     );
//                   }
//                 )}
//               </div>
//             )}
//         </div>
//       </div>

//       {/* MODALS */}

//       {selectedEvent && (
//         <EventDetailsModal
//           eventId={
//             selectedEvent.id
//           }
//           onClose={() =>
//             setSelectedEvent(
//               null
//             )
//           }
//         />
//       )}

//       {open && (
//         <CreateEventModal
//           templateId={
//             templateId
//           }
//           onClose={() =>
//             setOpen(false)
//           }
//         />
//       )}
//     </>
//   );
// }



"use client";

import {
  useSearchParams,
} from "next/navigation";

import { useRouter } from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import CreateEventModal
from "@/components/CreateEvent/CreateEventModal";

import EventDetailsModal
from "./EventDetailsModal";

import {
  useGetEventsQuery,
} from "@/store/apiSlice";

import styles
from "./Events.module.css";
import VerificationBanner from "@/components/VerificationBanner-Simple"
export default function EventsPage() {
  const router = useRouter();

  const params =
    useSearchParams();

  const templateId =
    params.get(
      "templateId"
    );

  const [open, setOpen] =
    useState(false);

  const [
    selectedEvent,
    setSelectedEvent,
  ] = useState<any>(
    null
  );

  const {
    data,
    isLoading,
  } =
    useGetEventsQuery();

  const events =
    data?.data || [];

  useEffect(() => {
    if (templateId) {
      setOpen(true);
    }
  }, [templateId]);

  const getEventStatus =
    (event: any) => {
      const pending =
        event.pendingCount ||
        0;

      if (pending > 0) {
        return {
          label:
            "In Progress",

          color:
            "#f59e0b",

          bg:
            "rgba(245,158,11,0.1)",

          border:
            "rgba(245,158,11,0.25)",
        };
      }

      if (
        event.failedCount >
        0
      ) {
        return {
          label:
            "Has Failures",

          color:
            "#f87171",

          bg:
            "rgba(248,113,113,0.1)",

          border:
            "rgba(248,113,113,0.25)",
        };
      }

      return {
        label:
          "Completed",

        color:
          "#34d399",

        bg:
          "rgba(52,211,153,0.1)",

        border:
          "rgba(52,211,153,0.25)",
      };
    };

  const getEventTypeIcon =
    (
      category: string
    ) => {
      const lower =
        category?.toLowerCase() ||
        "";

      if (
        lower.includes(
          "wedding"
        )
      )
        return "💍";

      if (
        lower.includes(
          "birthday"
        )
      )
        return "🎂";

      if (
        lower.includes(
          "business"
        )
      )
        return "🏢";

      return "🎉";
    };

  const getSentPercentage =
    (event: any) => {
      return event.totalGuests >
        0
        ? Math.round(
            (event.sentCount /
              event.totalGuests) *
              100
          )
        : 0;
    };

  const statistics = [
    {
      label:
        "Total Events",

      value:
        events.length,

      isPink: false,
    },

    {
      label:
        "Total Guests",

      value:
        events.reduce(
          (
            acc: number,
            event: any
          ) =>
            acc +
            (event.totalGuests ||
              0),
          0
        ),

      isPink: false,
    },

    {
      label:
        "Invites Sent",

      value:
        events.reduce(
          (
            acc: number,
            event: any
          ) =>
            acc +
            (event.sentCount ||
              0),
          0
        ),

      isPink: true,
    },

    {
      label:
        "Failed",

      value:
        events.reduce(
          (
            acc: number,
            event: any
          ) =>
            acc +
            (event.failedCount ||
              0),
          0
        ),

      isPink: false,
    },
  ];

  return (
    <>
    <VerificationBanner/>
      <div
        className={
          styles.blob
        }
        style={{
          width: 500,
          height: 500,
          left: "-10%",
          top: "-10%",
          background:
            "#e91e8c",
        }}
      />

      <div
        className={
          styles.blob
        }
        style={{
          width: 350,
          height: 350,
          right: "-8%",
          bottom: "10%",
          background:
            "#ff5252",
          animationDelay:
            "6s",
        }}
      />

      <div
        className={
          styles.page
        }
      >
        <div
          className={
            styles.inner
          }
        >
          <div
            className={
              styles.topbar
            }
          >
            <div>
              <h1
                className={
                  styles.title
                }
              >
                Your{" "}
                <span
                  className={
                    styles.titleHighlight
                  }
                >
                  Events
                </span>
              </h1>

              <p
                className={
                  styles.subtitle
                }
              >
                Manage and
                track all
                your invite
                campaigns
              </p>
            </div>

            <button
              className={
                styles.newBtn
              }
              onClick={() => {
                router.push('/templates');
              }}
            >
              <span
                className={
                  styles.newBtnIcon
                }
              >
                +
              </span>

              Create Event
            </button>
          </div>

          {!isLoading && (
            <div
              className={
                styles.stats
              }
            >
              {statistics.map(
                (
                  stat
                ) => (
                  <div
                    key={
                      stat.label
                    }
                    className={
                      styles.stat
                    }
                  >
                    <div
                      className={
                        styles.statLabel
                      }
                    >
                      {
                        stat.label
                      }
                    </div>

                    <div
                      className={`${styles.statValue} ${
                        stat.isPink
                          ? styles.statValuePink
                          : ""
                      }`}
                    >
                      {
                        stat.value
                      }
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {isLoading && (
            <div
              className={
                styles.loading
              }
            >
              <div
                className={
                  styles.spinner
                }
              />

              Loading
              events...
            </div>
          )}

          {!isLoading &&
            events.length ===
              0 && (
              <div
                className={
                  styles.empty
                }
              >
                <div
                  className={
                    styles.emptyIcon
                  }
                >
                  📭
                </div>

                <h2
                  className={
                    styles.emptyTitle
                  }
                >
                  No events
                  yet
                </h2>

                <p
                  className={
                    styles.emptyText
                  }
                >
                  Create your
                  first invite
                  campaign.
                </p>

                <button
                  className={
                    styles.emptyBtn
                  }
                  onClick={() => {
                    router.push('/templates');
                  }}
                >
                  🚀 Create
                  First Event
                </button>
              </div>
            )}

          {!isLoading &&
            events.length >
              0 && (
              <div
                className={
                  styles.grid
                }
              >
                {events.map(
                  (
                    event: any,
                    index: number
                  ) => {
                    const status =
                      getEventStatus(
                        event
                      );

                    const sentPct =
                      getSentPercentage(
                        event
                      );

                    return (
                      <div
                        key={
                          event.id
                        }
                        className={
                          styles.card
                        }
                        style={{
                          animationDelay: `${index * 60}ms`,
                        }}
                      >
                        <div
                          className={
                            styles.cardTop
                          }
                        >
                          <div
                            className={
                              styles.cardIcon
                            }
                          >
                            {getEventTypeIcon(
                              event
                                ?.template
                                ?.category
                            )}
                          </div>

                          <span
                            className={
                              styles.statusBadge
                            }
                            style={{
                              color:
                                status.color,

                              background:
                                status.bg,

                              borderColor:
                                status.border,
                            }}
                          >
                            {
                              status.label
                            }
                          </span>
                        </div>

                        <div
                          className={
                            styles.cardType
                          }
                        >
                          {
                            event
                              ?.template
                              ?.category
                          }
                        </div>

                        <div
                          className={
                            styles.cardTemplate
                          }
                        >
                          {
                            event
                              ?.template
                              ?.title
                          }
                        </div>

                        <div
                          className={
                            styles.progressLabel
                          }
                        >
                          <span>
                            Delivery
                            progress
                          </span>

                          <span>
                            {
                              sentPct
                            }
                            %
                          </span>
                        </div>

                        <div
                          className={
                            styles.progressTrack
                          }
                        >
                          <div
                            className={
                              styles.progressFill
                            }
                            style={{
                              width: `${sentPct}%`,
                            }}
                          />
                        </div>

                        <div
                          className={
                            styles.pills
                          }
                        >
                          <span
                            className={`${styles.pill} ${styles.pillSent}`}
                          >
                            ✓{" "}
                            {
                              event.sentCount
                            }{" "}
                            sent
                          </span>

                          {event.failedCount >
                            0 && (
                            <span
                              className={`${styles.pill} ${styles.pillFailed}`}
                            >
                              ✕{" "}
                              {
                                event.failedCount
                              }{" "}
                              failed
                            </span>
                          )}

                          {event.pendingCount >
                            0 && (
                            <span
                              className={`${styles.pill} ${styles.pillPending}`}
                            >
                              ⏳{" "}
                              {
                                event.pendingCount
                              }{" "}
                              pending
                            </span>
                          )}

                          <span
                            className={`${styles.pill} ${styles.pillDefault}`}
                          >
                            👥{" "}
                            {
                              event.totalGuests
                            }{" "}
                            total
                          </span>
                        </div>

                        <button
                          className={
                            styles.cardBtn
                          }
                          onClick={() =>
                            setSelectedEvent(
                              event
                            )
                          }
                        >
                          View
                          Details →
                        </button>
                      </div>
                    );
                  }
                )}
              </div>
            )}
        </div>
      </div>

      {selectedEvent && (
        <EventDetailsModal
          eventId={
            selectedEvent.id
          }
          onClose={() =>
            setSelectedEvent(
              null
            )
          }
        />
      )}

      {open && (
        <CreateEventModal
          templateId={
            templateId
          }
          onClose={() =>
            setOpen(false)
          }
        />
      )}
    </>
  );
}