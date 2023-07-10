import React from 'react';

interface ModalProps {
  title?: string;
  onClose: () => void;

  children: any;
}

export default function Modal(props: ModalProps) {
  return (
    <div className='fixed inset-0 bg-gray-400 bg-opacity-75 flex flex-col justify-center z-20'>
      <div className='modal-underlay fixed inset-0 bg-gray-400 bg-opacity-75' onClick={props.onClose} />

      <div className='flex flex-row justify-center z-20'>
        <div className='bg-white rounded-lg shadow-lg overflow-y-auto' style={{ minWidth: '480px', maxHeight: '90vh' }}>
          <div className='flex flex-row justify-between m-4 mb-0 pb-2 text-gray-600 font-bold border-b border-gray-400'>
            {props.title && <h2>{props.title}</h2>}

            <button className='text-lg text-gray-400 focus:outline-none' onClick={props.onClose}>
              x
            </button>
          </div>

          <div className='p-4 rounded-lg shadow-lg'>{props.children}</div>
        </div>
      </div>
    </div>
  );
}
