package com.team48.procompare.exception;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global exception handler for the application.
 * This class handles any exceptions thrown by controllers and returns appropriate HTTP responses.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    /**
     * Throws 404 Not Found from EmptyResultDataAccessException.
     */
    @ExceptionHandler(EmptyResultDataAccessException.class)
    public ResponseEntity<String> handleNotFound() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Requested resource not found.");
    }
}
