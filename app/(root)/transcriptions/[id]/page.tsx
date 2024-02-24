"use client"
import { getLessonById } from '@/lib/actions/transcription.action'
import { SearchParamProps } from '@/types';
import React from 'react'
import Image from 'next/image'
import jsPDF from 'jspdf'; // Client-side PDF library

const TranscriptionsPage = async ({ params: { id } }: SearchParamProps) => {

  const transcription = await getLessonById(id);

  const downloadHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    try {
      const doc = new jsPDF();
      const textLines = doc.splitTextToSize(transcription.transcript, 180); // Adjust width as needed

    let cursorY = 10;
    let pageNumber = 1;
    const pageHeight = doc.internal.pageSize.height;

    for (let i = 0; i < textLines.length; i++) {
      if (cursorY > pageHeight - 20) { // 20 is a margin for the bottom
        doc.addPage();
        cursorY = 10;
        pageNumber++;
      }
      doc.text(textLines[i], 10, cursorY);
      cursorY += 10; // Move to the next line
    }
      doc.save(`transcript-${transcription.name}.pdf`);
    } catch (error) {
      // Handle any errors during PDF generation
      console.error("Error creating PDF:", error);
    }

  }

  return (
    <div className="transcription-card">
            <h1 className="lesson-name">Lesson Name: {transcription.name}</h1>
            
          <button 
            className="download-btn" 
            onClick={downloadHandler}
          >
            <Image 
              src="/assets/icons/download.svg"
              alt="Download"
              width={24}
              height={24}
              className="pb-[6px]"
            />
          </button>
        
            <div className="transcription-text">
              <p>{transcription.transcript}</p>
            </div>
          </div>
    
  )
  
}

export default TranscriptionsPage