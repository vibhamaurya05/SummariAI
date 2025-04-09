import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";


export function NavigationControls({
    currentSection,
    totalSections,
    onPrevious,
    onNext,
    onSelectSelect,
}:{
    currentSection: number;
    totalSections: number;
    onPrevious: () => void;
    onNext: () => void;
    onSelectSelect: (index: number) => void;      
}){
    return (
        <div className="absolute bottom-0 left-0 right-0 flex justify-between p-4 bg-gray-100 dark:bg-gray-800 backdrop:blur-sm border-t border-gray-300 dark:border-gray-700 z-20">
            <div className="flex items-center justify-between w-full">
                <Button variant={'ghost'}
                size='icon'
                onClick={onPrevious}
                disabled={currentSection === 0}
                className={cn(`rounded-full w-8 sm:w-12 h-8 sm:h-12 transition-all duration-200 bg-linear-to-br from-blue-500 to-blue-600 backdrop-blur-xs border border-blue-500/10`, currentSection === 0 ? 'opacity-50': 'hover:bg-blue-500/20')}>
                    <ChevronLeft className="h-6 w-6" /> 
                </Button>

                <div className="flex gap-2 text-center  ">
                    {Array.from({ length: totalSections }, (_, index) => (
                       <button
                       key={index}
                       onClick={() => onSelectSelect(index)}
                          className={cn(`rounded-full w-1 h-1 sm:w-2 sm:h-2 flex items-center justify-center transition-all duration-200`, currentSection === index ? 'bg-blue-500 text-white' : 'bg-blue-200 text-gray-700 hover:bg-gray-300')}
                       />
                    ))}
                </div>

                <Button variant={'ghost'}
                size={'icon'}
                onClick={onNext}
                disabled={currentSection === totalSections - 1} 
                className={cn(`rounded-full  w-8 sm:w-12 h-8 sm:h-12  transition-all duration-200 bg-linear-to-br from-blue-500 to-blue-600 backdrop-blur-xs border border-blue-500/10`, currentSection === totalSections - 1 ? 'opacity-50': 'hover:bg-blue-500/20')}>
                    <ChevronRight className="h-6 w-6 " />
                </Button>
            </div>

        </div>
    )
}