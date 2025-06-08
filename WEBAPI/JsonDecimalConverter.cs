using System;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace WEBAPI
{
    public class JsonDecimalConverter : JsonConverter<decimal?>
    {
        //public override decimal? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        //{
        //    if (reader.TokenType == JsonTokenType.Null)
        //        return null;

        //    return reader.GetDecimal();
        //}
        public override decimal? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.String)
            {
                // Get the string value
                string stringValue = reader.GetString();

                // Remove the 'd' suffix if present
                if (stringValue.EndsWith("d", StringComparison.OrdinalIgnoreCase))
                {
                    stringValue = stringValue.Substring(0, stringValue.Length - 1);
                }

                // Try to parse the string as a decimal
                if (decimal.TryParse(stringValue, out decimal result))
                {
                    return result;
                }
                throw new JsonException($"Invalid decimal value: {stringValue}");
            }
            else if (reader.TokenType == JsonTokenType.Number)
            {
                // Directly read the number
                return reader.GetDecimal();
            }
            throw new JsonException($"Unexpected token type: {reader.TokenType}");
        }

        public override void Write(Utf8JsonWriter writer, decimal? value, JsonSerializerOptions options)
        {
            if (value.HasValue)
                writer.WriteStringValue(value.Value.ToString("F2", CultureInfo.InvariantCulture));
            else
                writer.WriteNullValue();
        }
        //public override void Write(Utf8JsonWriter writer, decimal? value, JsonSerializerOptions options)
        //{
        //    if (value.HasValue)
        //        writer.WriteStringValue(value.Value.ToString("F2", CultureInfo.InvariantCulture));
        //    else
        //        writer.WriteNullValue();
        //}
    }
}
