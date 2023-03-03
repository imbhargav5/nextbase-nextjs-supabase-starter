import { AnimatePresence, motion } from 'framer-motion';
import { ButtonHTMLAttributes } from 'react';
import { Button } from '../Button';

export const ModalHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`px-4 pt-4 pb-3 bg-white sm:px-6 ${className}`}>
      {children}
    </div>
  );
};

export const ModalBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`px-4 py-3 mb-2 bg-white sm:px-6 ${className}`}>
      {children}
    </div>
  );
};

export const ModalFooter = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`px-4 py-3 bg-gray-50 sm:px-6 ${className}`}>
      {children}
    </div>
  );
};

const modalOverlayVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.99,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

export const Modal = ({
  children,
  className,
  isOpen,
}: {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
}) => {
  const wrapperClassname = isOpen
    ? 'fixed z-10 inset-0 overflow-y-auto '
    : 'fixed z-10 inset-0 overflow-y-auto hidden';
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          transition={{
            duration: 0.15,
          }}
          variants={modalOverlayVariants}
          initial="hidden"
          animate={'visible'}
          exit={'hidden'}
          className={wrapperClassname}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 -z-10 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <motion.div
              variants={modalVariants}
              className={`inline-block z-10 relative align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${className}`}
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export const ModalSuccessButton = ({
  children,
  className,
  onClick,
  type,
}: ButtonProps) => {
  return (
    <Button
      type={type ?? 'button'}
      className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 ${className}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export const ModalCancelButton = ({
  children,
  className,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
