"use client";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import {
  selectTemplate as selectTemplateAction,
  setTemplates as setTemplatesAction,
  setGuests as setGuestsAction,
  updateEventDetails,
  selectMessageType,
  startImageGeneration,
  imageGenerationSuccess,
  imageGenerationFailed,
  selectGuests,
  selectWhatsappTemplate,
  paymentSuccess,
  eventCreated,
  updateSendingStatus,
  sendingCompleted,
  nextStep,
  previousStep,
  resetCreateEvent,
  setLoading,
  setError,
} from "@/store/slices/createEventSlice";

export const useCreateEvent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => state.createEvent);

  return {
    // ==================== STATE ====================
    selectedTemplate: state.selectedTemplate,
    eventDetails: state.eventDetails,
    messageType: state.messageType,
    imageGeneration: state.imageGeneration,
    selectedGuests: state.selectedGuests,
    whatsappTemplateId: state.whatsappTemplateId,
    pricing: state.pricing,
    paymentId: state.paymentId,
    eventId: state.eventId,
    sending: state.sending,
    currentStep: state.currentStep,
    loading: state.loading,
    error: state.error,
    templates: state.templates || [],
    guests: state.guests || [],
    templateParams: state.eventDetails.templateParams || {},

    // ==================== STEP 1: TEMPLATES ====================
    selectTemplate: (templateId: string) => {
      const template = (state.templates || []).find((t: any) => t.id === templateId);
      if (template) {
        dispatch(selectTemplateAction({ id: template.id, name: template.title, category: template.category }));
      }
    },

    setTemplate: (template: { id: string; name: string; category: string }) =>
      dispatch(selectTemplateAction(template)),

    setTemplates: (list: any[]) => dispatch(setTemplatesAction(list)),

    // ==================== STEP 2: EVENT DETAILS ====================
    setEventDetails: (details: any) => dispatch(updateEventDetails(details)),

    setTemplateParams: (params: any) =>
      dispatch(updateEventDetails({ ...state.eventDetails, templateParams: params })),

    setMessageType: (type: "text_only" | "image_only" | "image_and_text") =>
      dispatch(selectMessageType(type)),

    // ==================== STEP 2: IMAGE GENERATION ====================
    startImageGen: (jobId: string) => dispatch(startImageGeneration(jobId)),

    setImageSuccess: (imageUrl: string) => dispatch(imageGenerationSuccess(imageUrl)),

    setImageError: (error: string) => dispatch(imageGenerationFailed(error)),

    // ==================== STEP 3: GUESTS ====================
    setGuests: (list: any[]) => dispatch(setGuestsAction(list)),

    selectGuestIds: (guestIds: string[]) => dispatch(selectGuests(guestIds)),

    setWhatsappTemplate: (templateId: string) => dispatch(selectWhatsappTemplate(templateId)),

    // ==================== STEP 4: PAYMENT ====================
    setPaymentSuccess: (paymentId: string) => dispatch(paymentSuccess(paymentId)),

    // ==================== STEP 5: EVENT CREATED ====================
    setEventCreated: (eventId: string) => dispatch(eventCreated(eventId)),

    // ==================== STEP 5: SENDING STATUS ====================
    updateSendingStatus: (status: {
      sentCount: number;
      deliveredCount: number;
      readCount: number;
      failedCount: number;
      pendingCount: number;
    }) => dispatch(updateSendingStatus(status)),

    sendingCompleted: () => dispatch(sendingCompleted()),

    // ==================== NAVIGATION ====================
    goNext: () => dispatch(nextStep()),
    nextStep: () => dispatch(nextStep()),
    goPrev: () => dispatch(previousStep()),
    goToStep: (step: 1 | 2 | 3 | 4 | 5) => {
      // You can implement this if you add goToStep to reducers
      if (step >= 1 && step <= 5) {
        dispatch(nextStep()); // placeholder
      }
    },

    // ==================== RESET ====================
    resetCreateEvent: () => dispatch(resetCreateEvent()),

    // ==================== LOADING & ERRORS ====================
    setLoading: (loading: boolean) => dispatch(setLoading(loading)),
    setError: (error: string | null) => dispatch(setError(error)),
  };
};