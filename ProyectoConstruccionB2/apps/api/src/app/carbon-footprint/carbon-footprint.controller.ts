import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  formatCarbonFootprintResult,
  validateCarbonFootprintInput,
} from '@proyecto-construccion-b2/shared';
import { CarbonFootprintService } from './carbon-footprint.service';
import { CarbonFootprintInputDto } from './dto/carbon-footprint-input.dto';
import { FormattedCarbonFootprintResultDto } from './dto/formatted-carbon-footprint-result.dto';
import { RawCarbonFootprintResultDto } from './dto/raw-carbon-footprint-result.dto';
import { API_KEY_HEADER, ApiKeyGuard } from './guards/api-key.guard';

@ApiTags('carbon-footprint')
@Controller()
export class CarbonFootprintController {
  constructor(private readonly carbonFootprintService: CarbonFootprintService) {}

  @Post('v1/carbon-footprint')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Calcula la huella de carbono (API v1, libre)',
    description:
      'Endpoint público, sin autenticación. Devuelve el resultado "crudo" (solo números, sin formatear); el cliente aplica el formateador de libs/shared localmente.',
  })
  @ApiResponse({ status: 200, description: 'Cálculo realizado con éxito.', type: RawCarbonFootprintResultDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  calculateRaw(@Body() input: CarbonFootprintInputDto): RawCarbonFootprintResultDto {
    return this.calculate(input);
  }

  @Post('v2/carbon-footprint')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  @ApiSecurity(API_KEY_HEADER)
  @ApiHeader({
    name: API_KEY_HEADER,
    description: 'API key requerida para consumir la API v2.',
    required: true,
  })
  @ApiOperation({
    summary: 'Calcula la huella de carbono (API v2, segura)',
    description:
      'Endpoint protegido por API key. Reutiliza el formateador de libs/shared para devolver la respuesta ya procesada por el servidor.',
  })
  @ApiResponse({ status: 200, description: 'Cálculo realizado con éxito.', type: FormattedCarbonFootprintResultDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 401, description: 'API key ausente o inválida.' })
  calculateFormatted(
    @Body() input: CarbonFootprintInputDto,
  ): FormattedCarbonFootprintResultDto {
    const breakdown = this.calculate(input);
    return formatCarbonFootprintResult(breakdown);
  }

  private calculate(input: CarbonFootprintInputDto) {
    const validation = validateCarbonFootprintInput(input);
    if (!validation.valid) {
      throw new BadRequestException(validation.errors);
    }
    return this.carbonFootprintService.calculate(input);
  }
}
