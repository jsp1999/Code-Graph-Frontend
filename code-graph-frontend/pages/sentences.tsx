import React, { useState, useEffect } from "react";
import { getSentences } from "@/pages/api/api";
import Header from "@/components/Header";
import { Button } from "@mui/material";

type Sentence = {
  sentence_id: number;
  text: string;
};

export default function SentencesPage() {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(100);

  const project_id: number = 1;
  const dataset_id: number = 1;

  const fetchAndUpdateSentences = async (page: number, pageSize: number) => {
    try {
      const sentenceResponse: any = await getSentences(project_id, dataset_id, page, pageSize);
      const sentenceArray: Sentence[] = sentenceResponse.data.data;
      const sentenceCount = sentenceResponse.data.count;
      setSentences(sentenceArray);
      setTotalCount(sentenceCount);
    } catch (error) {
      console.error("Error fetching sentences:", error);
    }
  };

  useEffect(() => {
    fetchAndUpdateSentences(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const nextPage = () => {
    if (currentPage < Math.ceil(totalCount / pageSize) - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changePageSize = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  function HighlightAnnotatedWords({
    sentence,
    segments,
  }: {
    sentence: string;
    segments: { start_position: number; text: string }[];
  }) {
    // Function to split the sentence into words and apply highlights
    const splitSentenceWithHighlights = () => {
      let currentPosition = 0;
      let sentenceWords = [];

      // Sort segments by start_position
      const sortedSegments = segments.sort(
        (a: { start_position: number }, b: { start_position: number }) => a.start_position - b.start_position,
      );

      for (const segment of sortedSegments) {
        // Add words before the segment
        const segmentText = segment.text;
        if (segment.start_position > currentPosition) {
          const beforeSegmentText = sentence.slice(currentPosition, segment.start_position);
          sentenceWords.push({ text: beforeSegmentText, highlighted: false });
          currentPosition = segment.start_position;
        }

        // Add the annotated segment with a yellow background
        sentenceWords.push({ text: segmentText, highlighted: true });
        currentPosition += segmentText.length;
      }

      // Add any remaining words after the last segment
      if (currentPosition < sentence.length) {
        const remainingText = sentence.slice(currentPosition);
        sentenceWords.push({ text: remainingText, highlighted: false });
      }

      return sentenceWords;
    };

    const sentenceWords = splitSentenceWithHighlights();

    return (
      <div>
        {sentenceWords.map((word: { text: string; highlighted: boolean }, index: number) => (
          <span key={index} style={{ backgroundColor: word.highlighted ? "yellow" : "transparent" }}>
            {word.text}
          </span>
        ))}
      </div>
    );
  }

  return (
    <header>
      <Header title="sentences View" />
      <div className="flex justify-center mt-4">
        <Button variant="outlined" onClick={prevPage} disabled={currentPage === 0}>
          Previous Page
        </Button>
        <Button variant="outlined" onClick={nextPage} disabled={currentPage === Math.ceil(totalCount / pageSize) - 1}>
          Next Page
        </Button>
        <select value={pageSize} onChange={(e) => changePageSize(Number(e.target.value))} className="ml-2">
          <option value={100}>Page Size: 100</option>
          <option value={50}>Page Size: 50</option>
          <option value={2}>Page Size: 2</option>
        </select>
        <input
          type="number"
          value={currentPage}
          onChange={(e) => {
            const enteredValue = parseInt(e.target.value, 10);
            if (!isNaN(enteredValue)) {
              setCurrentPage(enteredValue);
            } else {
              // Handle empty input by setting it to 0
              setCurrentPage(0);
            }
          }}
          className="ml-2 p-1"
          style={{ width: "60px" }}
        />

        <span>/ {Math.ceil(totalCount / pageSize)}</span>
      </div>
      <div>
        {sentences.map((item: any) => (
          <div key={item.sentence_id}>
            <HighlightAnnotatedWords sentence={item.text} segments={item.segments} />
          </div>
        ))}
      </div>
    </header>
  );
}
