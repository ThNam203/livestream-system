package com.example.livestreaming.utils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class Common {
    public static String getFormattedId(String prefix, Long numericValue) {
        return prefix + numericValue;
    }
    public static String convertLocalDateToISOString (LocalDateTime date)
    {
        return date.format(DateTimeFormatter.ISO_DATE_TIME);
    }

    public static String convertDateToISOString (Date date)
    {
        return convertLocalDateToISOString(date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
    }
    public LocalDateTime convertISOStringToDate(String isoString)
    {
        return LocalDateTime.parse(isoString, DateTimeFormatter.ISO_DATE_TIME);
    }
}
