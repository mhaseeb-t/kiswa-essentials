const OrderStatusTracker = ({ currentStatus }) => {
  const steps = [
    { key: 'PENDING', label: 'Confirmed', icon: '1' },
    { key: 'PAID', label: 'Paid', icon: '2' },
    { key: 'SHIPPED', label: 'Shipped', icon: '3' },
    { key: 'DELIVERED', label: 'Delivered', icon: '4' },
  ];

  const statusOrder = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm
                  transition-all duration-300
                  ${isCompleted || isCurrent ? 'bg-[#c9b89a] text-[#0c0c0e]' : 'border-2 border-[#2a2a2e] text-[#6b6b6b]'}
                  ${isCurrent ? 'animate-pulse ring-4 ring-[#c9b89a]/30' : ''}
                `}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.icon
                )}
              </div>
              <span className={`mt-2 text-xs ${isCompleted || isCurrent ? 'text-[#f8f4ef]' : 'text-[#6b6b6b]'}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${
                  isCompleted ? 'bg-[#c9b89a]' : 'bg-[#2a2a2e]'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusTracker;