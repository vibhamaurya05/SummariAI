import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative mx-auto flex flex-col z-0 items-center justify-center py-16 mt-30 sm:py-20 lg:pb-28 transition-all animate-in lg:px-12 max-w-7xl ">

    <div className="relative p-[1px] overflow-hidden rounded-full bg-linear-to-r from-blue-200 via-blue-500 to-blue-800 ">
      <Badge className="relative px-6 py-2 text-base font-medium bg-white rounded-full group-hover:bg-gray-50 transition-colors duration-200">
        <Sparkles className="w-6 h-6 mr-2 text-blue-600 animate-pulse" />
        <p className="text-base text-blue-600">Powered by AI</p>
      </Badge>
    </div>

  <h1 className="font-bold py-6 text-center text-6xl w-4/6  flex-1 text-stone-300">
  Meet your Personalized AI Assistant Streamline your workflow
    </h1>
  <h2 className="text-lg sm:text-xl  text-center px-4 lg:px-0 lg:max-w-4xl text-gray-400">Get a beautiful summary reel of the document in seconds.</h2>
  <Button size={'lg'} className="rounded-full my-6 shadow-2xl shadow-blue-600"><Link href={'/summaryAI'} className="flex gap-2 items-center" >Try Brainwave Now
  <ArrowRight className="animate-pulse"/>
  </Link></Button>
</section>
  )
}

export default Hero
