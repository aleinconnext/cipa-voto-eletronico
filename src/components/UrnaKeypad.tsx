import { UrnaButton } from "./UrnaButton";

interface UrnaKeypadProps {
  onNumberClick: (number: string) => void;
  onCorrect: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  hideConfirmButton?: boolean;
  hideActionButtons?: boolean;
}

export const UrnaKeypad = ({ 
  onNumberClick, 
  onCorrect, 
  onConfirm, 
  confirmDisabled = false,
  hideConfirmButton = false,
  hideActionButtons = false
}: UrnaKeypadProps) => {
  const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', '']
  ];

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Teclado numérico */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 justify-items-center">
        {numbers.map((row, rowIndex) => 
          row.map((num, colIndex) => (
            num ? (
              <UrnaButton
                key={`${rowIndex}-${colIndex}`}
                variant="number"
                onClick={() => onNumberClick(num)}
              >
                {num}
              </UrnaButton>
            ) : (
              <div key={`${rowIndex}-${colIndex}`} className="w-12 h-12 md:w-16 md:h-16" />
            )
          ))
        )}
      </div>

      {/* Botões de ação */}
      {!hideActionButtons && (
        <div className="flex justify-center space-x-3 md:space-x-4 pt-3 md:pt-4">
          <UrnaButton variant="white" onClick={onCorrect}>
            CORRIGE
          </UrnaButton>
          {!hideConfirmButton && (
            <UrnaButton 
              variant="confirm" 
              onClick={onConfirm}
              disabled={confirmDisabled}
            >
              CONFIRMA
            </UrnaButton>
          )}
        </div>
      )}
    </div>
  );
};