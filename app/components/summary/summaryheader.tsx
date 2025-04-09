import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, Clock, Sparkles } from "lucide-react";
import Link from "next/link";

export function SummaryHeader({ title, createdAt }: { title: string, createdAt: Date }) {
    const readTime = 5;
    return (
        <div className="">
            <div className="flex gap-4 justify-between items-center w-full">

            <div className="space-y-6">
                <div className="sm:flex  gap-1 items-center">
                    <Badge variant={'secondary'} className=" relative px-4 py-1.5 text-sm font-medium bg-white/80 backdrop-blur-xs rounded-full hover:bg-white/90 transition-all duration-200 shadow-xs hover:shadow-md text-black mb-2 sm:mb-0">
                        <Sparkles className="h-4 w-4 mr-1.5 text-blue-600"/>
                        AI Summary
                    </Badge>
                    <div className="flex gap-3 items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 text-blue-600"/>
                        {new Date(createdAt).toLocaleDateString('en-us',{year:'numeric',
                            month:'long',
                            day:'numeric'
                        })}
                    </div>

                    {/* // minuts read  */}
                    <div className="flex gap-3 items-center text-sm text-muted-foreground capitalize">
                        <Clock className="h-4 w-4 text-blue-600"/>
                       {readTime} minuts read 
                    </div>
                </div>
               
            </div>
            <div className="self-start">
                <Link href={'/dashboard'}>
                <Button variant={'link'} size={'sm'} className="group flex items-center gap-1 sm:gap-2 hover:bg-white/80 backdrop-blur-xs rounded-full transition-all duration-200 shadow-xs hover:shadow-md borde4r boder-blue-100/30 bg-blue-100 px-2 sm:px-3 text-black capitalize no-underline">
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 transition-transform group-hover:translate-x-0.5"/>Back <span className="hidden sm:block">to dashboard</span></Button>
                </Link>
            </div>
            </div>

            
            <h1 className="text-3xl font-bold  w-full my-4
            ">{title}</h1>

        </div>
    )
}