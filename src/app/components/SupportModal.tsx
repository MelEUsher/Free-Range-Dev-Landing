'use client';

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type FormFields = {
  name: string;
  email: string;
  message: string;
};

type FieldErrors = Partial<FormFields>;

const FORM_ENDPOINT = "https://formspree.io/f/xdklvjpn";
const FOCUSABLE_ELEMENTS =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const INITIAL_FORM_FIELDS: FormFields = {
  name: "",
  email: "",
  message: "",
};

const NAME_INPUT_ID = "supportModalName";
const EMAIL_INPUT_ID = "supportModalEmail";
const MESSAGE_INPUT_ID = "supportModalMessage";
const MODAL_TITLE_ID = "supportModalTitle";
const TRIGGER_SELECTOR =
  '[data-support-modal-trigger], a[href="#supportModal"]';

const validateEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const SupportModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formFields, setFormFields] = useState<FormFields>(INITIAL_FORM_FIELDS);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successAnimationKey, setSuccessAnimationKey] = useState(0);

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      const fieldName = name as keyof FormFields;
      setFormFields((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
      setFieldErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[fieldName];
        return nextErrors;
      });
      setSubmissionError("");
    },
    []
  );

  const resetFormState = useCallback(() => {
    setFormFields(INITIAL_FORM_FIELDS);
    setFieldErrors({});
    setSubmissionError("");
    setIsSubmitting(false);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setIsSuccess(false);
    resetFormState();
  }, [resetFormState]);

  const openModal = useCallback(() => {
    previouslyFocusedElement.current =
      (document.activeElement as HTMLElement) ?? null;
    setIsOpen(true);
  }, []);

  const validateForm = useCallback(() => {
    const errors: FieldErrors = {};
    if (!formFields.name.trim()) {
      errors.name = "Please enter your name.";
    }
    if (!formFields.email.trim()) {
      errors.email = "Please enter your email.";
    } else if (!validateEmail(formFields.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!formFields.message.trim()) {
      errors.message = "Please enter your message.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formFields]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      setSubmissionError("");

      const payload = new FormData();
      payload.append("name", formFields.name.trim());
      payload.append("email", formFields.email.trim());
      payload.append("message", formFields.message.trim());

      try {
        const response = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: payload,
        });

        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }

        setIsSuccess(true);
        setSuccessAnimationKey((prev) => prev + 1);
        resetFormState();
      } catch (error) {
        console.error("Support form submission failed", error);
        setSubmissionError("Oops! There was a problem submitting your form.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formFields, resetFormState, validateForm]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const modalNode = modalRef.current;
    if (!modalNode) {
      return;
    }

    const focusableElements = Array.from(
      modalNode.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS)
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
      }

      if (event.key === "Tab" && focusableElements.length > 0) {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            (lastElement ?? firstElement)?.focus();
          }
        } else if (document.activeElement === lastElement) {
          event.preventDefault();
          (firstElement ?? lastElement)?.focus();
        }
      }
    };

    const focusTimeout = window.requestAnimationFrame(() => {
      (closeButtonRef.current ?? firstElement)?.focus();
    });

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusTimeout);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal, isOpen, isSuccess]);

  useEffect(() => {
    if (!isOpen && previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus();
      previouslyFocusedElement.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    const triggers = document.querySelectorAll(TRIGGER_SELECTOR);

    const handleTriggerClick = (event: Event) => {
      event.preventDefault();
      openModal();
    };

    triggers.forEach((trigger) =>
      trigger.addEventListener("click", handleTriggerClick)
    );

    return () => {
      triggers.forEach((trigger) =>
        trigger.removeEventListener("click", handleTriggerClick)
      );
    };
  }, [openModal]);

  const overlayStateClasses = isOpen
    ? "opacity-100 pointer-events-auto"
    : "opacity-0 pointer-events-none";
  const modalStateClasses = isOpen
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-4";

  const nameErrorId = fieldErrors.name ? "support-name-error" : undefined;
  const emailErrorId = fieldErrors.email ? "support-email-error" : undefined;
  const messageErrorId = fieldErrors.message ? "support-message-error" : undefined;

  return (
    <div
      id="supportModal"
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-[rgba(0,0,0,0.4)] backdrop-blur-sm px-4 sm:px-6 md:px-8 py-6 sm:py-10 md:py-[10%] transition-opacity duration-300 ease-out overflow-y-auto overscroll-contain ${overlayStateClasses}`}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        aria-modal="true"
        aria-labelledby={MODAL_TITLE_ID}
        className={`w-[90%] max-w-[600px] rounded-[10px] border border-[#888888] bg-[#dce8f2] p-5 sm:p-6 md:p-7 shadow-[0_4px_8px_rgba(0,0,0,0.2)] transition-all duration-300 ease-out my-6 sm:my-8 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto ${modalStateClasses}`}
        role="dialog"
        tabIndex={-1}
      >
        <div className="flex justify-end -mt-2 -mr-2 sm:-mt-3 sm:-mr-3">
          <button
            aria-label="Close Support Squad modal"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-3xl text-[#aaaaaa] transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffbd59]"
            onClick={closeModal}
            ref={closeButtonRef}
            type="button"
          >
            &times;
          </button>
        </div>

        <h3
          id={MODAL_TITLE_ID}
          className="mb-5 text-center font-display text-xl font-bold text-[#1f2d3d]"
        >
          Contact Support Squad
        </h3>

        {!isSuccess && (
          <form
            aria-describedby={submissionError ? "support-form-error" : undefined}
            className="flex flex-col gap-4"
            action={FORM_ENDPOINT}
            method="POST"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-semibold text-[#1f2d3d]"
                htmlFor={NAME_INPUT_ID}
              >
                Your name:
              </label>
              <input
                aria-describedby={nameErrorId}
                aria-invalid={Boolean(fieldErrors.name)}
                autoComplete="name"
                className="w-full rounded-md border border-[#a8bdb0] bg-white px-3 py-2 text-[#1f2d3d] placeholder:text-[#6b7c89] focus:border-[#95a89d] focus:outline-none focus:ring-2 focus:ring-[#95a89d]"
                id={NAME_INPUT_ID}
                maxLength={120}
                name="name"
                onChange={handleInputChange}
                placeholder="Your name"
                required
                type="text"
                value={formFields.name}
              />
              {fieldErrors.name && (
                <p className="text-sm text-red-600" id={nameErrorId}>
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-semibold text-[#1f2d3d]"
                htmlFor={EMAIL_INPUT_ID}
              >
                Your email:
              </label>
              <input
                aria-describedby={emailErrorId}
                aria-invalid={Boolean(fieldErrors.email)}
                autoComplete="email"
                className="w-full rounded-md border border-[#a8bdb0] bg-white px-3 py-2 text-[#1f2d3d] placeholder:text-[#6b7c89] focus:border-[#95a89d] focus:outline-none focus:ring-2 focus:ring-[#95a89d]"
                id={EMAIL_INPUT_ID}
                maxLength={254}
                name="email"
                onChange={handleInputChange}
                placeholder="Your email"
                required
                type="email"
                value={formFields.email}
              />
              {fieldErrors.email && (
                <p className="text-sm text-red-600" id={emailErrorId}>
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-semibold text-[#1f2d3d]"
                htmlFor={MESSAGE_INPUT_ID}
              >
                Your message:
              </label>
              <textarea
                aria-describedby={messageErrorId}
                aria-invalid={Boolean(fieldErrors.message)}
                className="w-full rounded-md border border-[#a8bdb0] bg-white px-3 py-2 text-[#1f2d3d] placeholder:text-[#6b7c89] focus:border-[#95a89d] focus:outline-none focus:ring-2 focus:ring-[#95a89d]"
                id={MESSAGE_INPUT_ID}
                maxLength={1500}
                name="message"
                onChange={handleInputChange}
                placeholder="Your message"
                required
                rows={4}
                value={formFields.message}
              />
              {fieldErrors.message && (
                <p className="text-sm text-red-600" id={messageErrorId}>
                  {fieldErrors.message}
                </p>
              )}
            </div>

            <button
              aria-busy={isSubmitting}
              className="w-full rounded-md border border-transparent bg-[#a8bdb0] px-5 py-3 text-base font-bold uppercase tracking-wide text-[#333333] transition-colors duration-200 hover:bg-[#95a89d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffbd59] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              Send
            </button>

            {submissionError && (
              <p
                className="text-center text-sm font-semibold text-red-600"
                id="support-form-error"
                role="alert"
              >
                {submissionError}
              </p>
            )}
          </form>
        )}

        {isSuccess && (
          <div
            aria-live="polite"
            className="mt-4 flex flex-col items-center text-center text-[#a8bdb0] text-pretty"
          >
            <div className="checkmark-container" role="presentation">
              <svg
                key={successAnimationKey}
                className="checkmark"
                viewBox="0 0 52 52"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="checkmark-circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className="checkmark-check"
                  d="m14.1 27.2 7.1 7.2 16.7-16.8"
                  fill="none"
                />
              </svg>
            </div>
            <p className="mb-2 font-semibold text-[#a8bdb0]">
              Thank you for connecting with The Free Range Dev Support Squad.
            </p>
            <p>Expect to hear from us within the next 24 business hours.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { SupportModal };
export default SupportModal;
