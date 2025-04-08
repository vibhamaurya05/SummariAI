"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "./prisma"


export async function deleteSummary({summaryId}:{summaryId:string}){
    const response =  await prisma.pdf_summary.delete({
        where:{
            id:summaryId
        }
    })
    if(response){
        revalidatePath('/dashboard')
    }
   return response
}