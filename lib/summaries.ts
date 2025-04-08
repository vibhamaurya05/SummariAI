import { prisma } from "@/lib/prisma";

export async function getSummaries(userId: string) {
    try {
        const response = await prisma.pdf_summary.findMany({
            where: { userId: userId },
        });

        if (response.length === 0) {
            console.log("No summaries found for this user");
            return [];
        }
        return response;
    } catch (error) {
        console.error("Error fetching summaries:", error);
        return [];
    }
}

export async function getSummariesById(summaryId: string){
    try {
        const response = await prisma.pdf_summary.findUnique({
            where:{
                id:summaryId
            }
        })
        if(!response){
            console.log("No summaries ")
            return ;
        }
        return response;
    } catch (error) {
        console.error("Error fetching summaries:", error);
        return ;
    }
}
