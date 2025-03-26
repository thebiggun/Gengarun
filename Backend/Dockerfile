FROM gcc:latest
WORKDIR /app
COPY text.cpp /app/text.cpp
RUN g++ text.cpp -o text
CMD ["./text"]