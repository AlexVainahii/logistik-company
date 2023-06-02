import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import {
  ReviewAuthor,
  ReviewContainer,
  ReviewContent,
  ReviewForm,
  ReviewInput,
  ReviewSubmitButton,
} from "./Reviews.styled";
import { addReviews, getReviews } from "../fakeApi";
import ReviewsIcon from "@mui/icons-material/Reviews";

export const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewContent, setNewReviewContent] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedReviews = await getReviews();
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Помилка при отриманні перевезень:", error);
      }
    };

    fetchData();
  }, []);
  const handleReviewAuthorChange = (event) => {
    setNewReviewAuthor(event.target.value);
  };

  const handleReviewContentChange = (event) => {
    setNewReviewContent(event.target.value);
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();
    if (newReviewAuthor.trim() !== "" && newReviewContent.trim() !== "") {
      const newReview = {
        id: nanoid(),
        author: newReviewAuthor,
        content: newReviewContent,
      };
      addReviews(newReview);
      setReviews([...reviews, newReview]);
      setNewReviewAuthor("");
      setNewReviewContent("");
    }
  };

  return (
    <section>
      <div>
        <h2>Відгуки</h2>
        {reviews.map((review) => (
          <ReviewContainer key={review.id}>
            <ReviewAuthor>{review.author}</ReviewAuthor>
            <ReviewContent>{review.content}</ReviewContent>
          </ReviewContainer>
        ))}
        <ReviewForm onSubmit={handleReviewSubmit}>
          <ReviewInput
            type="text"
            placeholder="Ваше ім'я"
            value={newReviewAuthor}
            onChange={handleReviewAuthorChange}
            required
          />
          <ReviewInput
            type="text"
            placeholder="Ваш відгук"
            value={newReviewContent}
            onChange={handleReviewContentChange}
            required
          />
          <ReviewSubmitButton type="submit">
            Надіслати відгук <ReviewsIcon style={{ marginLeft: "20px" }} />
          </ReviewSubmitButton>
        </ReviewForm>
      </div>
    </section>
  );
};
